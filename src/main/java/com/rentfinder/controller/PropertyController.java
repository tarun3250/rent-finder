package com.rentfinder.controller;

import com.rentfinder.dto.PropertyMatchResponse;
import com.rentfinder.entity.Property;
import com.rentfinder.service.PropertyService;
import com.rentfinder.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<?> getAllProperties(
            @RequestParam(required = false) Double budget,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) String bhk
    ) {
        if (ownerId != null) {
            return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId));
        }
        return ResponseEntity.ok(recommendationService.getRecommendations(budget, location, bhk));
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestBody Property property,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.rentfinder.entity.User user
    ) {
        property.setOwner(user);
        return ResponseEntity.ok(propertyService.createProperty(property));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Property> verifyProperty(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.verifyProperty(id));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<PropertyMatchResponse>> getRecommendations(
            @RequestParam(required = false, defaultValue = "1000000.0") Double budget,
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(required = false, defaultValue = "") String bhk
    ) {
        return ResponseEntity.ok(recommendationService.getRecommendations(budget, location, bhk));
    }
}
