package com.rentfinder.service;

import com.rentfinder.entity.ListingRequest;
import com.rentfinder.repository.ListingRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingRequestService {

    private final ListingRequestRepository listingRequestRepository;
    private final com.rentfinder.repository.PropertyRepository propertyRepository;

    public ListingRequest createRequest(ListingRequest request) {
        return listingRequestRepository.save(request);
    }

    public List<ListingRequest> getMyRequests(Long ownerId) {
        return listingRequestRepository.findByOwnerId(ownerId);
    }

    public List<ListingRequest> getAllRequests() {
        return listingRequestRepository.findAll();
    }

    public ListingRequest updateStatus(Long id, String status) {
        ListingRequest request = listingRequestRepository.findById(id).orElseThrow();
        request.setStatus(status);
        return listingRequestRepository.save(request);
    }

    public ListingRequest completeRequest(Long id, com.rentfinder.entity.Property propertyData) {
        ListingRequest request = listingRequestRepository.findById(id).orElseThrow();
        
        com.rentfinder.entity.Property property = com.rentfinder.entity.Property.builder()
                .title(propertyData.getTitle())
                .description(propertyData.getDescription())
                .price(propertyData.getPrice())
                .location(propertyData.getLocation())
                .bhkType(propertyData.getBhkType())
                .amenities(propertyData.getAmenities())
                .verified(true)
                .owner(request.getOwner())
                .build();
        
        propertyRepository.save(property);
        
        request.setStatus("COMPLETED");
        return listingRequestRepository.save(request);
    }
}
