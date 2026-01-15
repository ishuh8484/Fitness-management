package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity){
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getRecommendations(prompt);
        log.info("Response from AI {} ",aiResponse);
        return processAIResponse(activity,aiResponse);
    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {
        try{
            //to work with json in java
            ObjectMapper mapper = new ObjectMapper();

            //to convert json to tree,
            //so that we can navigate to key-value pair to
            //extract values of "text"
            //this is the rootnode of json
            JsonNode rootNode = mapper.readTree(aiResponse);

            //to navigate to "text" node
            JsonNode textNode = rootNode.path("candidates")
                    //as it is in form of array
                    .get(0)
                    .path("content")
                    .get("parts")
                    .get(0)
                    .path("text");

            //here we are cleaning content from text
            //as we are replacing ```json\n with empty space
            //and trimming it further , as we want text only
            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();

            log.info("cleaned Response from AI {} ",jsonContent);


           JsonNode analysisJson = mapper.readTree(jsonContent);
           JsonNode analysisNode = analysisJson.path("analysis");

           StringBuilder fullAnalysis = new StringBuilder();
           addAnalysisSection(fullAnalysis,analysisNode,"overall","Overall:");
           addAnalysisSection(fullAnalysis,analysisNode,"pace","Pace:");
           addAnalysisSection(fullAnalysis,analysisNode,"heartRate","Heart Rate:");
           addAnalysisSection(fullAnalysis,analysisNode,"caloriesBurned","Calories Burned:");

           List<String> improvements = extractImprovements(analysisNode.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisNode.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisNode.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .type(activity.getType().toString())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            
        }catch(Exception e){
           
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }

        
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType().toString())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting with fitness consultant"))
                .safety(Arrays.asList(
                        "Always warm before exercise",
                        "Drink water to stay hydrated"
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safetyGuidelines = new ArrayList<>();
        if(safetyNode.isArray()) {
            safetyNode.forEach(item -> safetyGuidelines.add(item.asText()));

        }

        return safetyGuidelines.isEmpty() ?
                Collections.singletonList("No specific safety instructions provided,follow general guidelines") :
                safetyGuidelines;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion->{
                String safetyDetails = suggestion.path("safety").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s",safetyDetails,description));
            });
        }

        return suggestions.isEmpty() ?
                Collections.singletonList("No specific description provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {

        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement->{
                String area = improvement.path("area").asText();
                String details = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s",area,details));
            });
        }

        return improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;

    }

    //we are getting data from AI model in this
    //format : "overall": "this is excellent"

    //we are converting this to human readable format
    //Overall: this is excellent
    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCalories(),
                activity.getAdditionalMetric()
        );
    }
}
