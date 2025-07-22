package com.example.backend.controller;

import com.example.backend.service.SpotifyTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.json.*;

import java.util.*;

@RestController
@RequestMapping("/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SpotifyTokenService spotifyTokenService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam("query") String query) {
        String accessToken = spotifyTokenService.getAccessToken();
        String url = "https://api.spotify.com/v1/search?q=" + query + "&type=album&limit=10";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JSONObject json = new JSONObject(response.getBody());

            JSONArray albums = json.getJSONObject("albums").getJSONArray("items");

            List<Map<String, Object>> result = new ArrayList<>();

            for (int i = 0; i < albums.length(); i++) {
                JSONObject album = albums.getJSONObject(i);
                Map<String, Object> albumData = new HashMap<>();

                albumData.put("id", album.getString("id"));
                albumData.put("name", album.getString("name"));
                albumData.put("releaseDate", album.getString("release_date"));

                // grab image (first one is largest)
                JSONArray images = album.getJSONArray("images");
                albumData.put("image", images.length() > 0 ? images.getJSONObject(0).getString("url") : null);

                // grab first artist
                JSONArray artists = album.getJSONArray("artists");
                albumData.put("artist", artists.length() > 0 ? artists.getJSONObject(0).getString("name") : "Unknown");

                result.add(albumData);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Spotify Fetch Failed: " + e.getMessage())));
        }
    }
}
