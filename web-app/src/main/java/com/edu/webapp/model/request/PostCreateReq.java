package com.edu.webapp.model.request;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.enums.RoomStatus;
import com.edu.webapp.model.enums.TypeRoom;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostCreateReq {
    private String title;
    private String content;
    private double price;
    private double deposit;
    private String address;
    private double acreage;
    private RoomStatus statusRoom;
    private String contact;
    private OffsetDateTime expirationDate;
    private List<MultipartFile> images;
    private String province;
    private String district;
    private String map;
    private ActiveStatus active;
    private TypeRoom type;
}
