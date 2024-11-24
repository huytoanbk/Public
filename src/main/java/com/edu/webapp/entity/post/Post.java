package com.edu.webapp.entity.post;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.enums.RoomStatus;
import com.edu.webapp.model.enums.TypeRoom;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "POST")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT", columnDefinition = "TEXT")
    private String content;

    @Column(name = "PRICE")
    private double price;

    @Column(name = "DEPOSIT")
    private double deposit;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "ACREAGE")
    private double acreage;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS_ROOM")
    private RoomStatus statusRoom = RoomStatus.EMPTY;

    @Column(name = "CONTACT")
    private String contact;

    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private OffsetDateTime createdAt;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "UPDATED_AT")
    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "EXPIRATION_DATE")
    private OffsetDateTime expirationDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images;


    @Column(name = "PROVINCE")
    private String province;

    @Column(name = "DISTRICT")
    private String district;

    @Column(name = "VIEW")
    private Long view = 0L;

    @Column(name = "LONGITUDE")
    private String longitude;

    @Column(name = "LATITUDE")
    private String latitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE")
    private ActiveStatus active = ActiveStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "TYPE")
    private TypeRoom type;

}
