package com.edu.webapp.entity.post;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.print.DocFlavor;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "post")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PostEls {
    private String id;
    private String title;
    private String content;
    private double price;
    private double deposit;
    private String address;
    private double acreage;
    private String statusRoom;
    private String contact;
    private OffsetDateTime createdAt;
    private String createdBy;
    private OffsetDateTime updatedAt;
    private String updatedBy;
    private OffsetDateTime expirationDate;
    private String province;
    private String district;
    private String longitude;
    private String latitude;
    private String active;
    private String type;
}
