package com.social.ws.verify;

import com.social.ws.file.FileAttachment;
import com.social.ws.file.FileService;
import com.social.ws.user.User;
import com.social.ws.user.UserRepository;
import com.social.ws.verify.vm.VerificationRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class VerificationRequestService {
    private final VerificationRequestRepository verificationRequestRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @Autowired
    public VerificationRequestService(VerificationRequestRepository verificationRequestRepository, UserRepository userRepository, FileService fileService) {
        this.verificationRequestRepository = verificationRequestRepository;
        this.userRepository = userRepository;
        this.fileService = fileService;
    }

    public List<VerificationRequest> getVerificationRequests() {
        return verificationRequestRepository.findAll();
    }

    public void createVerificationRequestWithFile(User user, MultipartFile multipartFile, String reason) {
        VerificationRequest verificationRequest = new VerificationRequest();
        verificationRequest.setUser(user);
        verificationRequest.setReason(reason);
        if (multipartFile != null) {
            FileAttachment attachment = fileService.saveVerificationAttachment(multipartFile);
            verificationRequest.setAttachment(attachment.getName());
        }
        verificationRequestRepository.save(verificationRequest);
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
        VerificationRequest request = verificationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification request ID"));
        String attachmentName = request.getAttachment();
        deleteVerificationRequest(id);
        if (attachmentName != null) {
            fileService.deleteVerificationAttachment(attachmentName);
        }
    }

    public void deleteVerificationRequest(long id) {
        verificationRequestRepository.deleteById(id);
    }
}