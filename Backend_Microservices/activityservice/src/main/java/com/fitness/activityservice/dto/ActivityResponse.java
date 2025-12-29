package com.fitness.activityservice.dto;

import com.fitness.activityservice.model.ActivityTime;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {


    private String id;
    private String userId;
    private ActivityTime type;
    private Integer duration;
    private Integer calories;
    private LocalDateTime startTime;
    //String{n time}->{activity}
    private Map<String,Object> additionalMetric;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
