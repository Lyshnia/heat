package com.example.application.data.endpoint;

import com.example.application.data.entity.Todo;
import com.example.application.data.service.TodoRepo;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class TodoEndpoint {
    private TodoRepo repo;

    public TodoEndpoint(TodoRepo repo) {
        this.repo = repo;
    }

    public List<Todo> findAll() {
        return repo.findAll();
    }

    public Todo save(Todo todo) {
        return repo.save(todo);
    }

    public void delete(Todo todo) {
        repo.delete(todo);
    }
}
