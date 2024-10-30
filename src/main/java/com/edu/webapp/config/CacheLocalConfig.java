package com.edu.webapp.config;

import com.edu.webapp.entity.user.Role;
import com.edu.webapp.repository.RoleRepository;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class CacheLocalConfig {
    private final RoleRepository roleRepository;

    private final LoadingCache<String, Role> cacheRole = CacheBuilder
            .newBuilder()
            .expireAfterAccess(1, TimeUnit.HOURS)
            .maximumSize(20)
            .build(new CacheLoader<String, Role>() {
                @Override
                public Role load(String key) throws Exception {
                    return roleRepository.findByName(key);
                }
            });

    public Role getRoleByName(String name) {
        return cacheRole.getUnchecked(name);
    }
}
