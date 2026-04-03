package com.rentfinder.event;

import org.springframework.context.ApplicationEvent;

public class PropertyVerifiedEvent extends ApplicationEvent {
    
    private final Long propertyId;
    private final Long ownerId;

    public PropertyVerifiedEvent(Object source, Long propertyId, Long ownerId) {
        super(source);
        this.propertyId = propertyId;
        this.ownerId = ownerId;
    }

    public Long getPropertyId() { return propertyId; }
    public Long getOwnerId() { return ownerId; }
}
