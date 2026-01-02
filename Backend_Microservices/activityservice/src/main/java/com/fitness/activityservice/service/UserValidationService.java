package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {


    //so this will give us web client , means user service web client will
    //be injected here , as that user service web client is bean which is available
    //and preconfigured , which is pointing to USERSERVICE

    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId){

        log.info("Calling User Service for {}",userId);
       try {
           return userServiceWebClient.get()
                   .uri("/api/users/{userId}/validate", userId)
                   .retrieve()
                   .bodyToMono(Boolean.class)
                   .block();
       }
       catch(WebClientResponseException e){
           e.printStackTrace();
       }

       return false;
    }
}
