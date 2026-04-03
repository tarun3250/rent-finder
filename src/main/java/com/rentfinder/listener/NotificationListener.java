package com.rentfinder.listener;

import com.rentfinder.entity.Notification;
import com.rentfinder.entity.User;
import com.rentfinder.event.PropertyCreatedEvent;
import com.rentfinder.event.PropertyVerifiedEvent;
import com.rentfinder.repository.NotificationRepository;
import com.rentfinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Async
    @EventListener
    public void handlePropertyCreatedEvent(PropertyCreatedEvent event) {
        log.info("Handling PropertyCreatedEvent for Property ID: {}", event.getPropertyId());
        
        Optional<User> ownerOpt = userRepository.findById(event.getOwnerId());
        if (ownerOpt.isPresent()) {
            Notification notification = Notification.builder()
                    .user(ownerOpt.get())
                    .message("Your property '" + event.getPropertyTitle() + "' has been created tracking.")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
            log.info("Notification saved for user ID: {}", event.getOwnerId());
        }
    }

    @Async
    @EventListener
    public void handlePropertyVerifiedEvent(PropertyVerifiedEvent event) {
        log.info("Handling PropertyVerifiedEvent for Property ID: {}", event.getPropertyId());
        
        Optional<User> ownerOpt = userRepository.findById(event.getOwnerId());
        if (ownerOpt.isPresent()) {
            Notification notification = Notification.builder()
                    .user(ownerOpt.get())
                    .message("Congratulations! Your property (ID: " + event.getPropertyId() + ") has been verified.")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
            log.info("Notification saved for user ID: {}", event.getOwnerId());
        }
    }
}
