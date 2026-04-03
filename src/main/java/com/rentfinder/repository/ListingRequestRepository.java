package com.rentfinder.repository;

import com.rentfinder.entity.ListingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRequestRepository extends JpaRepository<ListingRequest, Long> {
    List<ListingRequest> findByOwnerId(Long ownerId);
    List<ListingRequest> findByStatus(String status);
}
