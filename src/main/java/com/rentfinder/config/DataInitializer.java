package com.rentfinder.config;

import com.rentfinder.entity.Property;
import com.rentfinder.entity.User;
import com.rentfinder.entity.UserRole;
import com.rentfinder.repository.PropertyRepository;
import com.rentfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@rentfinder.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(UserRole.ADMIN)
                    .build();
            userRepository.save(admin);

            // Create Owner
            User owner = User.builder()
                    .name("John Owner")
                    .email("owner@rentfinder.com")
                    .password(passwordEncoder.encode("owner123"))
                    .role(UserRole.OWNER)
                    .build();
            userRepository.save(owner);

            // Create Tenant
            User tenant = User.builder()
                    .name("Jane Tenant")
                    .email("tenant@rentfinder.com")
                    .password(passwordEncoder.encode("tenant123"))
                    .role(UserRole.TENANT)
                    .build();
            userRepository.save(tenant);

            // Create Sample Properties
            Property p1 = Property.builder()
                    .title("Luxury Penthouse in Bandra")
                    .description("A beautiful penthouse with sea view.")
                    .price(85000.0)
                    .location("Bandra West, Mumbai")
                    .bhkType("3 BHK")
                    .amenities("[\"Parking\", \"Gym\", \"Pool\"]")
                    .verified(true)
                    .owner(owner)
                    .build();
            
            Property p2 = Property.builder()
                    .title("Modern Studio in Indiranagar")
                    .description("Perfect for young professionals.")
                    .price(25000.0)
                    .location("Indiranagar, Bangalore")
                    .bhkType("1 BHK")
                    .amenities("[\"Wifi\", \"Power Backup\"]")
                    .verified(true)
                    .owner(owner)
                    .build();

            propertyRepository.saveAll(List.of(p1, p2));
        }
    }
}
