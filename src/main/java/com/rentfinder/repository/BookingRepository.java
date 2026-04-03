package com.rentfinder.repository;

import com.rentfinder.entity.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findByTenantId(Long tenantId);
    List<BookingRequest> findByPropertyOwnerId(Long ownerId);
}
