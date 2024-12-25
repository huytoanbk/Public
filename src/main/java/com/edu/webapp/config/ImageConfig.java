package com.edu.webapp.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.image")
@Getter
@Setter
public class ImageConfig {
    private List<String> types;

    public boolean isAllowedImageType(String contentType) {
        return types.stream().anyMatch(type -> type.equalsIgnoreCase(contentType));
    }
}
