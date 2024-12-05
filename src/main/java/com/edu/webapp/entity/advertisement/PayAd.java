package com.edu.webapp.entity.advertisement;

import com.edu.webapp.model.enums.ActiveStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PAY_AD")
public class PayAd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ADVERTISING_PACKAGE")
    private Integer advertisingPackage;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "PRICE")
    private double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE")
    private ActiveStatus active = ActiveStatus.INACTIVE;

    @CreationTimestamp
    @Column(name = "CREATED_AT")
    private OffsetDateTime createdAt;

    @Column(name = "TYPE")
    private Integer type;

    @Column(name = "DESCRIPTION")
    private String description;
}
