package com.social.ws.verify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/1.0/verifications")
public class VerificationRequestController {
    private final VerificationRequestService verificationRequestService;

    @Autowired
    public VerificationRequestController(VerificationRequestService verificationRequestService) {
        this.verificationRequestService = verificationRequestService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/applications")
    public List<VerificationRequestDTO> getVerificationRequests() {
        List<VerificationRequest> requests = verificationRequestService.getVerificationRequests();
        return requests.stream()
                .map(verificationRequestService::convertToDTO)
                .collect(Collectors.toList());
    }


    @PostMapping("/create/{username}")
    @PreAuthorize("#username == principal.username or hasRole('ADMIN')")
    public ResponseEntity<String> createVerificationRequest(@PathVariable String username, @RequestBody VerificationRequest verificationRequest) {
        verificationRequestService.createVerificationRequest(verificationRequest);
        return ResponseEntity.ok("Verification request created successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public void approveVerificationRequest(@PathVariable long id) {
        verificationRequestService.approveVerificationRequest(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/unverify")
    public ResponseEntity<String> unVerifyUser(@PathVariable long id) {
        try {
            verificationRequestService.unVerifyUser(id);
            return ResponseEntity.ok("User unverified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unverifying user");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public void rejectVerificationRequest(@PathVariable long id) {
        verificationRequestService.rejectVerificationRequest(id);
    }
}