package com.rentfinder.listener;

import com.rentfinder.event.PropertyCreatedEvent;
import com.rentfinder.event.PropertyVerifiedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AnalyticsListener {

    @Async
    @EventListener
    public void handlePropertyCreatedForAnalytics(PropertyCreatedEvent event) {
        // Mock method for system-wide metrics asynchronously
        log.info("[ANALYTICS] Tracker incremented for newly created property ID: {}", event.getPropertyId());
    }

    @Async
    @EventListener
    public void handlePropertyVerifiedForAnalytics(PropertyVerifiedEvent event) {
        // Mock method for system-wide metrics asynchronously
        log.info("[ANALYTICS] Tracker marked property ID: {} as verified.", event.getPropertyId());
    }
}
