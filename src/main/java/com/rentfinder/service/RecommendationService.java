package com.rentfinder.service;

import com.rentfinder.dto.PropertyMatchResponse;
import com.rentfinder.entity.Property;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final PropertyService propertyService;

    @Cacheable(value = "recommendations", key = "{#budget, #location, #bhkType}")
    public List<PropertyMatchResponse> getRecommendations(Double budget, String location, String bhkType) {
        List<Property> allProperties = propertyService.getAllProperties();

        return allProperties.stream()
                .map(property -> calculateMatch(property, budget, location, bhkType))
                .sorted(Comparator.comparingInt(PropertyMatchResponse::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    private PropertyMatchResponse calculateMatch(Property property, Double budget, String location, String bhkType) {
        int score = 0;
        Map<String, String> reasons = new HashMap<>();

        // 40% Budget Match
        if (budget != null) {
            double priceDiff = Math.abs(property.getPrice() - budget) / budget;
            if (priceDiff <= 0.1) {
                score += 40;
                reasons.put("Budget Match", "Excellent (within 10%)");
            } else if (priceDiff <= 0.25) {
                score += 20;
                reasons.put("Budget Match", "Good (within 25%)");
            } else {
                reasons.put("Budget Match", "Poor (outside 25%)");
            }
        }

        // 30% Location Match
        if (location != null && !location.isEmpty()) {
            if (property.getLocation().toLowerCase().contains(location.toLowerCase())) {
                score += 30;
                reasons.put("Location Match", "High (exact area matching)");
            } else {
                reasons.put("Location Match", "Low (different area)");
            }
        }

        // 20% BHK Type Match
        if (bhkType != null && !bhkType.isEmpty()) {
            if (bhkType.equalsIgnoreCase(property.getBhkType())) {
                score += 20;
                reasons.put("Requirements", "High (Matches BHK required)");
            } else {
                reasons.put("Requirements", "Low (Different BHK option)");
            }
        }

        // 10% Verification
        if (Boolean.TRUE.equals(property.getVerified())) {
            score += 10;
            reasons.put("Verification", "Property is verified by platform");
        }

        // Anti-Bias and Visibility Boost
        int visibilityScore = score;
        if (property.getViewCount() != null && property.getViewCount() < 50) {
            visibilityScore += 15; // Give newer or less-viewed properties a chance
        }
        if (property.getBoostLevel() != null) {
            visibilityScore += property.getBoostLevel() * 10; // Paid or organic boost
        }

        // Owner Trust Score calculation (mock logic: if verified + base trust)
        int trustScore = 70; // Base score
        if (Boolean.TRUE.equals(property.getVerified())) {
            trustScore += 20;
        }

        return PropertyMatchResponse.builder()
                .property(property)
                .matchScore(visibilityScore)
                .reasons(reasons)
                .ownerTrustScore(trustScore)
                .build();
    }
}
