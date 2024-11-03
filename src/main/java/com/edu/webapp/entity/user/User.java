package com.edu.webapp.entity.user;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.enums.NotiStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "USER")
public class User implements UserDetails, Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", updatable = false, nullable = false)
    private String id;

    @Column(name = "FULL_NAME")
    private String fullName;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "PASSWORD")
    private String password;

    @Lob
    @Column(name = "AVATAR", columnDefinition = "LONGBLOB")
    private byte[] avatar;

    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private OffsetDateTime createdAt;

    @Column(name = "UPDATED_AT")
    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE")
    private ActiveStatus active = ActiveStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "NOTI_STATUS")
    private NotiStatus notiStatus = NotiStatus.INACTIVE;

    @Column(name = "PROVINCE")
    private String province;

    @Column(name = "DISTRICT")
    private String district;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "INTRODUCE", columnDefinition = "TEXT")
    private String introduce;

    @Column(name = "UPTIME")
    private OffsetDateTime Uptime;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "USER_ROLES",
            joinColumns = @JoinColumn(name = "USER_ID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_ID")
    )
    private List<Role> roles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return active.isActiveStatus();
    }
}
