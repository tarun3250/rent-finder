package com.rentfinder.event;

import org.springframework.context.ApplicationEvent;

public class PropertyCreatedEvent extends ApplicationEvent {
    
    private final Long propertyId;
    private final String propertyTitle;
    private final Long ownerId;

    public PropertyCreatedEvent(Object source, Long propertyId, String propertyTitle, Long ownerId) {
        super(source);
        this.propertyId = propertyId;
        this.propertyTitle = propertyTitle;
        this.ownerId = ownerId;
    }

    public Long getPropertyId() { return propertyId; }
    public String getPropertyTitle() { return propertyTitle; }
    public Long getOwnerId() { return ownerId; }
}
