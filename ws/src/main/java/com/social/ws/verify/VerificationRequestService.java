package com.social.ws.verify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationRequestService {

    private final VerificationRequestRepository verificationRequestRepository;

    @Autowired
    public VerificationRequestService(VerificationRequestRepository verificationRequestRepository) {
        this.verificationRequestRepository = verificationRequestRepository;
    }

    public List<VerificationRequest> getVerificationRequests() {
        return verificationRequestRepository.findAll();
    }

    public void approveVerificationRequest(long id) {
        // TODO: Implement approve logic
    }

    public void rejectVerificationRequest(long id) {
        // TODO: Implement reject logic
    }
}
