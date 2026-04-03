package com.rentfinder.controller;

import com.rentfinder.dto.StatusRequest;
import com.rentfinder.entity.ListingRequest;
import com.rentfinder.entity.Property;
import com.rentfinder.entity.User;
import com.rentfinder.service.ListingRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ListingRequestController {

    private final ListingRequestService listingRequestService;

    @PostMapping
    public ResponseEntity<ListingRequest> createRequest(
            @RequestBody ListingRequest request,
            @AuthenticationPrincipal User user
    ) {
        request.setOwner(user);
        return ResponseEntity.ok(listingRequestService.createRequest(request));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<ListingRequest>> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(listingRequestService.getMyRequests(user.getId()));
    }

    @GetMapping
    public ResponseEntity<List<ListingRequest>> getAllRequests() {
        return ResponseEntity.ok(listingRequestService.getAllRequests());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ListingRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest statusRequest
    ) {
        return ResponseEntity.ok(listingRequestService.updateStatus(id, statusRequest.getStatus()));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ListingRequest> completeRequest(
            @PathVariable Long id,
            @RequestBody Property propertyData
    ) {
        return ResponseEntity.ok(listingRequestService.completeRequest(id, propertyData));
    }
}
