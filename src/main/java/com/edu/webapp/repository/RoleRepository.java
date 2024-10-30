package com.edu.webapp.repository;


import com.edu.webapp.entity.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    boolean existsByName(String name);

    Role findByName(String name);

    List<Role> findAllByOrderByNameAsc();
}
