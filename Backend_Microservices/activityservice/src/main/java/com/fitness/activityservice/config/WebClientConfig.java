package com.fitness.activityservice.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    //this gives us instance of webclient builder
    @Bean
    //to call service or to find service by its service name
    // rather than its address or locating through port number
    @LoadBalanced
    public WebClient.Builder webClientBuilder(){
        return WebClient.builder();
    }



    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder){
        return webClientBuilder().baseUrl("http://USERSERVICE")
                .build();
    }

    //so this is basically instance of web client which is pointing to
    //it will basically expose this as BEAN in application

    //so wherever we want to take this instance , we can take this instance of userservice WEBCLIENT
    //,then we can call userservice API
}
