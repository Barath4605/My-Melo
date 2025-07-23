package com.example.backend.service;

import com.example.backend.DTO.TrackDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpotifyAlbumService {

    @Autowired
    private SpotifyTokenService tokenService;

    public List<TrackDTO> getAlbumTracks(String albumId) {
        String url = "https://api.spotify.com/v1/albums/" + albumId + "/tracks";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + tokenService.getAccessToken());
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        String responseBody = response.getBody();

        List<TrackDTO> tracks = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);
            JsonNode items = root.path("items");

            for (JsonNode item : items) {
                String name = item.path("name").asText();
                String urlLink = item.path("external_urls").path("spotify").asText();
                tracks.add(new TrackDTO(name, urlLink));
            }
        } catch (Exception e) {
            throw new RuntimeException("error parsing Spotify response", e);
        }

        return tracks;
    }
}
