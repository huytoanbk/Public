package com.edu.webapp.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostUserRes {
    private String id;
    private String title;
    private String statusRoom;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime expirationDate;
    private Long view = 0L;
    private String active;
    private String type;
}
