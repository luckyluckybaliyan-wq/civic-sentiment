package com.civicconnect.controller;

import com.civicconnect.dto.Dtos.*;
import com.civicconnect.model.*;
import com.civicconnect.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintRepository complaints;
    private final UserRepository users;

    public ComplaintController(ComplaintRepository complaints, UserRepository users) {
        this.complaints = complaints; this.users = users;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplaintResponse create(@Valid @RequestBody ComplaintRequest req, Authentication auth) {
        Complaint c = new Complaint();
        c.setTitle(req.title());
        c.setDescription(req.description());
        c.setCategory(req.category());
        c.setWard(req.ward());
        c.setAddress(req.address());
        c.setUser(currentUser(auth));
        return ComplaintResponse.from(complaints.save(c));
    }

    @GetMapping("/mine")
    public List<ComplaintResponse> mine(Authentication auth) {
        return complaints.findByUserIdOrderByCreatedAtDesc(currentUser(auth).getId())
                .stream().map(ComplaintResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ComplaintResponse one(@PathVariable Long id, Authentication auth) {
        Complaint c = complaints.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        User me = currentUser(auth);
        if (me.getRole() != Role.ADMIN && !c.getUser().getId().equals(me.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This is not your complaint");
        return ComplaintResponse.from(c);
    }

    private User currentUser(Authentication auth) {
        return users.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in again"));
    }
}
