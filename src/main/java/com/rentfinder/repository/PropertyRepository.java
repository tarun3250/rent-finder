package com.rentfinder.repository;

import com.rentfinder.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwnerId(Long ownerId);
    List<Property> findByVerifiedTrue();

    @Query("SELECT p FROM Property p WHERE p.verified = true AND p.price <= :budget AND p.location LIKE %:location%")
    List<Property> searchProperties(@Param("budget") Double budget, @Param("location") String location);
}
