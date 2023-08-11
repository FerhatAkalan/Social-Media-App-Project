package com.social.ws.verify;

import com.social.ws.auth.AuthException;
import com.social.ws.user.User;
import com.social.ws.user.UserRepository;
import com.social.ws.user.UserService;
import com.social.ws.user.vm.UserVM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationRequestService {
    private final VerificationRequestRepository verificationRequestRepository;
    private final UserRepository userRepository;

    @Autowired
    public VerificationRequestService(VerificationRequestRepository verificationRequestRepository, UserRepository userRepository) {
        this.verificationRequestRepository = verificationRequestRepository;
        this.userRepository = userRepository;
    }

    public List<VerificationRequest> getVerificationRequests() {
        return verificationRequestRepository.findAll();
    }

    public void createVerificationRequest(VerificationRequest verificationRequest) {
        User userFromDB = userRepository.findById(verificationRequest.getUser().getId()).orElse(null);
        if (userFromDB != null) {
            verificationRequest.setUser(userFromDB);
            verificationRequestRepository.save(verificationRequest);
        }
    }

    public VerificationRequestDTO convertToDTO(VerificationRequest request) {
        VerificationRequestDTO dto = new VerificationRequestDTO();
        dto.setId(request.getId());

        if (request.getUser() != null) {
            dto.setUserId(request.getUser().getId());
            dto.setUsername(request.getUser().getUsername());
            dto.setVerified(request.getUser().isVerified());
        }

        dto.setReason(request.getReason());
        dto.setAttachment(request.getAttachment());

        return dto;
    }

    public void approveVerificationRequest(long id) {
        VerificationRequest request = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification request ID"));

        User user = request.getUser();
        user.setVerified(true);
        userRepository.save(user);
        verificationRequestRepository.save(request);
    }

    public void unVerifyUser(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        user.setVerified(false);
        userRepository.save(user);
    }

    public void rejectVerificationRequest(long id) {
        deleteVerificationRequest(id);
    }

    public void deleteVerificationRequest(long id) {
        verificationRequestRepository.deleteById(id);
    }
}