package com.example.backend.controller;

import com.example.backend.DTO.TrackDTO;
import com.example.backend.service.SpotifyAlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/spotify")
public class TracklistController {

    @Autowired
    private SpotifyAlbumService albumService;

    @CrossOrigin(origins = "*")
    @GetMapping("/album/{id}/tracks")
    public ResponseEntity<List<TrackDTO>> getTracks(@PathVariable String id) {
        List<TrackDTO> tracks = albumService.getAlbumTracks(id);
        return ResponseEntity.ok(tracks);
    }

}
