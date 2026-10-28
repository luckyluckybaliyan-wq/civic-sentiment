package com.civicconnect.controller;

import com.civicconnect.dto.Dtos.*;
import com.civicconnect.model.Notice;
import com.civicconnect.repository.NoticeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    private final NoticeRepository notices;

    public NoticeController(NoticeRepository notices) { this.notices = notices; }

    @GetMapping
    public List<NoticeResponse> all() {
        return notices.findAllByOrderByPublishedAtDesc().stream().map(NoticeResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoticeResponse create(@Valid @RequestBody NoticeRequest req) {
        Notice n = new Notice();
        n.setTitle(req.title());
        n.setBody(req.body());
        return NoticeResponse.from(notices.save(n));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { notices.deleteById(id); }
}
