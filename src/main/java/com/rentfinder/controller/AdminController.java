package com.rentfinder.controller;

import com.rentfinder.repository.UserRepository;
import com.rentfinder.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long usersCount = userRepository.count();
        long revenue = propertyRepository.findByVerifiedTrue().size() * 5000L;
        
        return ResponseEntity.ok(Map.of(
            "activeUsers", usersCount,
            "totalRevenue", revenue
        ));
    }
}
