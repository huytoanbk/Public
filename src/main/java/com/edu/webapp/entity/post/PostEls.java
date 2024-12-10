package com.edu.webapp.entity.post;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.print.DocFlavor;
import java.sql.Timestamp;
import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "post")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PostEls {
    @Id
    private String id;
    private String title;
    private String content;
    private double price;
    private double deposit;
    private String address;
    private double acreage;
    private String statusRoom;
    private String contact;
    @Field(type = FieldType.Date)
    private Timestamp createdAt;
    private String createdBy;
    @Field(type = FieldType.Date)
    private Timestamp updatedAt;
    private String updatedBy;
    private String province;
    private String district;
    private String longitude;
    private String latitude;
    private String active;
    private String type;
    private Integer vip;
}
