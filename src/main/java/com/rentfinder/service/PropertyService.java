package com.rentfinder.service;

import com.rentfinder.entity.Property;
import com.rentfinder.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public List<Property> getAllProperties() {
        return propertyRepository.findByVerifiedTrue();
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    public List<Property> searchProperties(Double budget, String location) {
        return propertyRepository.searchProperties(budget, location);
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property verifyProperty(Long id) {
        Property property = propertyRepository.findById(id).orElseThrow();
        property.setVerified(true);
        return propertyRepository.save(property);
    }

    public List<Property> getRecommendations(Double budget, String location, String bhkType) {
        // Simple recommendation logic: verified properties within budget and same location/bhk
        return propertyRepository.searchProperties(budget, location);
    }
}
