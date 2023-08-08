package com.social.ws.verify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/1.0/verifications-request")
public class VerificationRequestController {

    private final VerificationRequestService verificationRequestService;

    @Autowired
    public VerificationRequestController(VerificationRequestService verificationRequestService) {
        this.verificationRequestService = verificationRequestService;
    }

    @GetMapping
    public List<VerificationRequest> getVerificationRequests() {
        return verificationRequestService.getVerificationRequests();
    }

    @PostMapping("/{id}/approve")
    public void approveVerificationRequest(@PathVariable long id) {
        verificationRequestService.approveVerificationRequest(id);
    }

    @PostMapping("/{id}/reject")
    public void rejectVerificationRequest(@PathVariable long id) {
        verificationRequestService.rejectVerificationRequest(id);
    }
}

