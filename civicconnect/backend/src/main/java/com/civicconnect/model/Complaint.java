package com.civicconnect.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Complaint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, length = 2000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;
    @Column(nullable = false)
    private String ward;
    private String address;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;
    @Column(length = 1000)
    private String adminRemark;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User user;

    @PreUpdate
    void touch() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public Category getCategory() { return category; }
    public void setCategory(Category c) { this.category = c; }
    public String getWard() { return ward; }
    public void setWard(String w) { this.ward = w; }
    public String getAddress() { return address; }
    public void setAddress(String a) { this.address = a; }
    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus s) { this.status = s; }
    public String getAdminRemark() { return adminRemark; }
    public void setAdminRemark(String r) { this.adminRemark = r; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public User getUser() { return user; }
    public void setUser(User u) { this.user = u; }
}
