package com.rentfinder.service;

import com.rentfinder.entity.Property;
import com.rentfinder.event.PropertyCreatedEvent;
import com.rentfinder.event.PropertyVerifiedEvent;
import com.rentfinder.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final ApplicationEventPublisher eventPublisher;

    public List<Property> getAllProperties() {
        return propertyRepository.findByVerifiedTrue();
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    public List<Property> searchProperties(Double budget, String location) {
        return propertyRepository.searchProperties(budget, location);
    }

    @CacheEvict(value = "recommendations", allEntries = true)
    public Property createProperty(Property property) {
        if (property.getImages() != null) {
            property.getImages().forEach(img -> img.setProperty(property));
        }
        Property savedProperty = propertyRepository.save(property);
        eventPublisher.publishEvent(new PropertyCreatedEvent(
                this, 
                savedProperty.getId(), 
                savedProperty.getTitle(), 
                savedProperty.getOwner().getId()
        ));
        return savedProperty;
    }

    @CacheEvict(value = "recommendations", allEntries = true)
    public Property verifyProperty(Long id) {
        Property property = propertyRepository.findById(id).orElseThrow();
        property.setVerified(true);
        Property savedProperty = propertyRepository.save(property);
        eventPublisher.publishEvent(new PropertyVerifiedEvent(
                this,
                savedProperty.getId(),
                savedProperty.getOwner().getId()
        ));
        return savedProperty;
    }

}
