package com.example.application.data.endpoint;

import com.vaadin.flow.server.VaadinRequest;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;

@Endpoint
@AnonymousAllowed
public class MVEndpoint {

    public MVEndpoint() {
    }

    public String getNames() {
        return VaadinRequest.getCurrent().getUserPrincipal().getName();
    }
}
