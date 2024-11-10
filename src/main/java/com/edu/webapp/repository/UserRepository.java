package com.edu.webapp.repository;

import com.edu.webapp.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    List<User> findAllByEmailIn(Set<String> usernames);

    List<User> findAllByIdIn(Set<String> usernames);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneAndEmailIsNot(String phone, String email);

    Page<User> findByEmailContaining(String email, Pageable pageable);
}
