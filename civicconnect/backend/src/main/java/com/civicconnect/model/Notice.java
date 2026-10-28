package com.civicconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, length = 3000)
    private String body;
    private LocalDateTime publishedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getBody() { return body; }
    public void setBody(String b) { this.body = b; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
}
