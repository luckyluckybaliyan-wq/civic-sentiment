package com.civicconnect.repository;

import com.civicconnect.model.Complaint;
import com.civicconnect.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    long countByStatus(ComplaintStatus status);
}
