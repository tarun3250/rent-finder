package com.rentfinder.dto;

import com.rentfinder.entity.Property;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class PropertyMatchResponse {
    private Property property;
    private int matchScore;
    private Map<String, String> reasons;
    private int ownerTrustScore;
}
