package com.example.application.data.entity;

import org.springframework.security.core.GrantedAuthority;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.util.*;

@Entity
public class UserInfo {
    private String name;
    @Nullable
    private String username;
    @Nullable
    private Long id;
    Collection<String> authorities = new ArrayList<>();

    public UserInfo(String name, Collection<String> authorities) {
        this.id = 1L;
        this.name = name;
        this.authorities = Collections.unmodifiableCollection(authorities);
    }

    public UserInfo() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @ElementCollection(targetClass=String.class)
    public Collection<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<String> authorities) {
        this.authorities = authorities;
    }
}
