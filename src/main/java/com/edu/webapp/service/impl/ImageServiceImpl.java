package com.edu.webapp.service.impl;

import com.edu.webapp.config.ImageConfig;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    @Value("${app.image.upload-dir}")
    private String UPLOAD_DIR;
    private final ImageConfig imageConfig;

    @Override
    public String upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidateException(ErrorCodes.IMAGE_EMPTY);
        }
        String contentType = file.getContentType();
        if (!imageConfig.isAllowedImageType(contentType)) {
            throw new ValidateException(ErrorCodes.IMAGE_VALID);
        }
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());
            return new URI("http://localhost:8888" + fileName).toASCIIString();
        } catch (IOException | URISyntaxException e) {
            throw new ValidateException(ErrorCodes.UPLOAD_IMAGE_ERROR);
        }
    }
}
