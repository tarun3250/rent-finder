package com.rental.service;

import com.rental.entity.Property;
import com.rental.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;

    public List<Property> getRecommendations(BigDecimal budget, String location, String bhk, List<String> amenities) {
        List<Property> properties = propertyRepository.findByIsVerifiedTrue();

        return properties.stream()
            .map(property -> {
                int score = calculateScore(property, budget, location, bhk, amenities);
                // In a real app, you'd use a DTO with a score field
                return property; 
            })
            .sorted((p1, p2) -> 0) // Sort by score in real implementation
            .collect(Collectors.toList());
    }

    private int calculateScore(Property property, BigDecimal budget, String location, String bhk, List<String> amenities) {
        int score = 0;

        // Budget match (40%)
        if (property.getPrice().compareTo(budget) <= 0) {
            score += 40;
        } else if (property.getPrice().compareTo(budget.multiply(new BigDecimal("1.2"))) <= 0) {
            score += 20;
        }

        // Location proximity (30%)
        if (property.getLocation().toLowerCase().contains(location.toLowerCase())) {
            score += 30;
        }

        // Amenities match (20%)
        // Logic to parse JSON amenities and match

        // Preference match (BHK) (10%)
        if (property.getBhkType().equals(bhk)) {
            score += 10;
        }

        return score;
    }
}
