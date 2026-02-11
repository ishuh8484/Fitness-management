package com.fitness.activityservice.service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    private final UserValidationService userValidationService;

    private final KafkaTemplate<String,Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;



    public ActivityResponse trackActivity(ActivityRequest request) {

        boolean isValidUser =  userValidationService.validateUser(request.getUserId());

        if(!isValidUser){
            throw new RuntimeException("Invalid User: "+ request.getUserId());
        }
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .calories(request.getCalories())
                .startTime(request.getStartTime())
                .additionalMetric(request.getAdditionalMetric())
                .build();


        Activity savedActivity = activityRepository.save(activity);
        
        // Send to Kafka asynchronously (non-blocking) to prevent Kafka outages from failing activity saves
        try {
            kafkaTemplate.send(topicName, savedActivity.getUserId(), savedActivity)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        // Log error but don't fail the request
                        System.err.println("Failed to send activity to Kafka: " + ex.getMessage());
                        ex.printStackTrace();
                    } else {
                        System.out.println("Activity sent to Kafka successfully");
                    }
                });
        } catch (Exception e) {
            // Catch any immediate exceptions and log them without failing the request
            System.err.println("Error sending activity to Kafka: " + e.getMessage());
            e.printStackTrace();
        }

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCalories(activity.getCalories());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetric(activity.getAdditionalMetric());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());

        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {

        List<Activity> activityList = activityRepository.findByUserId(userId);

        return activityList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }
}
