package com.rentfinder.controller;

import com.rentfinder.entity.Property;
import com.rentfinder.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties(
            @RequestParam(required = false) Double budget,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long ownerId
    ) {
        if (ownerId != null) {
            return ResponseEntity.ok(propertyService.getPropertiesByOwner(ownerId));
        }
        if (budget != null || location != null) {
            return ResponseEntity.ok(propertyService.searchProperties(
                    budget != null ? budget : 1000000.0,
                    location != null ? location : ""
            ));
        }
        return ResponseEntity.ok(propertyService.getAllProperties());
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
    public ResponseEntity<List<Property>> getRecommendations(
            @RequestParam(required = false, defaultValue = "1000000.0") Double budget,
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(required = false, defaultValue = "") String bhk
    ) {
        return ResponseEntity.ok(propertyService.getRecommendations(budget, location, bhk));
    }
}
