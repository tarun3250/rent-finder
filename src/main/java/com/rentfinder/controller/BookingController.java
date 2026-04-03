package com.rentfinder.controller;

import com.rentfinder.entity.BookingRequest;
import com.rentfinder.entity.Property;
import com.rentfinder.entity.User;
import com.rentfinder.repository.BookingRepository;
import com.rentfinder.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;

    @PostMapping("/{propertyId}")
    public ResponseEntity<BookingRequest> createBooking(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal User tenant
    ) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
                
        BookingRequest booking = BookingRequest.builder()
                .tenant(tenant)
                .property(property)
                .status("PENDING")
                .build();
                
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingRequest>> getMyBookings(@AuthenticationPrincipal User user) {
        if ("OWNER".equals(user.getRole().name())) {
            return ResponseEntity.ok(bookingRepository.findByPropertyOwnerId(user.getId()));
        }
        return ResponseEntity.ok(bookingRepository.findByTenantId(user.getId()));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body
    ) {
        BookingRequest booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(body.get("status"));
        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}
