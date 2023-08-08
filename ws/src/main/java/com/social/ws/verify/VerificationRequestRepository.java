package com.social.ws.verify;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, Long> {
    // Ek özel sorguları buraya ekleyebilirsiniz.
}
