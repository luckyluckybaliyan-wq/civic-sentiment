package com.civicconnect.dto;

import com.civicconnect.model.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public final class Dtos {
    private Dtos() {}

    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String phone) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, Role role) {}

    public record ComplaintRequest(
            @NotBlank @Size(max = 120) String title,
            @NotBlank @Size(max = 2000) String description,
            @NotNull Category category,
            @NotBlank String ward,
            String address) {}

    public record StatusUpdateRequest(@NotNull ComplaintStatus status, @Size(max = 1000) String remark) {}

    public record ComplaintResponse(Long id, String title, String description, Category category, String ward,
                                    String address, ComplaintStatus status, String adminRemark,
                                    LocalDateTime createdAt, LocalDateTime updatedAt, String citizenName) {
        public static ComplaintResponse from(Complaint c) {
            return new ComplaintResponse(c.getId(), c.getTitle(), c.getDescription(), c.getCategory(), c.getWard(),
                    c.getAddress(), c.getStatus(), c.getAdminRemark(), c.getCreatedAt(), c.getUpdatedAt(),
                    c.getUser().getName());
        }
    }

    public record NoticeRequest(@NotBlank String title, @NotBlank String body) {}

    public record NoticeResponse(Long id, String title, String body, LocalDateTime publishedAt) {
        public static NoticeResponse from(Notice n) {
            return new NoticeResponse(n.getId(), n.getTitle(), n.getBody(), n.getPublishedAt());
        }
    }

    public record StatsResponse(long total, long submitted, long inProgress, long resolved, long rejected) {}
}
