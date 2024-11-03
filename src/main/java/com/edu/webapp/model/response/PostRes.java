package com.edu.webapp.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostRes {
    private String id;
    private String title;
    private String content;
    private double price;
    private double deposit;
    private String address;
    private double acreage;
    private String statusRoom;
    private String contact;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime createdAt;
    private String createdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime updatedAt;
    private String updatedBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime expirationDate;
    private List<String> images;
    private String province;
    private String district;
    private Long view = 0L;
    private String map;
    private String active;
    private String type;

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Data
    static class UserPostRes {
        private String id;
    }
}
