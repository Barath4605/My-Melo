package com.example.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.Base64;
import java.util.Map;

@Service
public class SpotifyTokenService {

    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    private String accessToken;
    private long expiryTime;

    public String getAccessToken() {
        long currentTime = System.currentTimeMillis();
        if (accessToken == null || currentTime >= expiryTime) {
            fetchAccessToken();
        }
        return accessToken;
    }

    private void fetchAccessToken() {
        String url = "https://accounts.spotify.com/api/token";
        RestTemplate restTemplate = new RestTemplate();

        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + encodedCredentials);

        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
        );

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseBody = mapper.readValue(response.getBody(), Map.class);

            this.accessToken = (String) responseBody.get("access_token");
            int expiresIn = (int) responseBody.get("expires_in");
            this.expiryTime = System.currentTimeMillis() + (expiresIn * 1000L);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse token response", e);
        }
    }
}
