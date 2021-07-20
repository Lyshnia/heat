package com.example.application.data.endpoint;

import com.example.application.Quote;
import com.example.application.data.entity.UserInfo;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;

import javax.annotation.security.PermitAll;
import java.util.List;
import java.util.stream.Collectors;

@Endpoint
@AnonymousAllowed
public class UserInfoEndpoint {

    public UserInfoEndpoint() {
    }

    public UserInfo getUserInfo(String username) {

        UserInfo info = new UserInfo();
        info.setId(1L);
        info.setName("JErry");
        info.setUsername(username);
        return info;
    }

    @PermitAll
    public UserInfo getUserInfo() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();

        final List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        System.out.println("authorities = " + authorities);

        /*RestTemplate restTemplate = new RestTemplate();

        // Send request with GET method and default Headers.
        String result = restTemplate.getForObject("https://quoters.apps.pcfone.io/api/random", String.class);

        System.out.println("result = " + result);*/

        return new UserInfo(auth.getName(), authorities);
    }

}
