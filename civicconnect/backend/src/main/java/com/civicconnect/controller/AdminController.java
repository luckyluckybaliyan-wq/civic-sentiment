package com.civicconnect.controller;

import com.civicconnect.dto.Dtos.*;
import com.civicconnect.model.*;
import com.civicconnect.repository.ComplaintRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class AdminController {
    private final ComplaintRepository complaints;

    public AdminController(ComplaintRepository complaints) { this.complaints = complaints; }

    /** Public headline numbers shown on the home page. */
    @GetMapping("/api/public/stats")
    public StatsResponse stats() {
        return new StatsResponse(
                complaints.count(),
                complaints.countByStatus(ComplaintStatus.SUBMITTED),
                complaints.countByStatus(ComplaintStatus.IN_PROGRESS),
                complaints.countByStatus(ComplaintStatus.RESOLVED),
                complaints.countByStatus(ComplaintStatus.REJECTED));
    }

    @GetMapping("/api/admin/complaints")
    public List<ComplaintResponse> all(@RequestParam(required = false) ComplaintStatus status) {
        List<Complaint> list = status == null
                ? complaints.findAllByOrderByCreatedAtDesc()
                : complaints.findByStatusOrderByCreatedAtDesc(status);
        return list.stream().map(ComplaintResponse::from).toList();
    }

    @PatchMapping("/api/admin/complaints/{id}/status")
    public ComplaintResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        Complaint c = complaints.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        c.setStatus(req.status());
        c.setAdminRemark(req.remark());
        return ComplaintResponse.from(complaints.save(c));
    }
}
