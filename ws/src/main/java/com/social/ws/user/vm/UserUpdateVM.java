package com.social.ws.user.vm;

import com.social.ws.shared.FileType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;
    @FileType(types = {"peg", "png"})
    private String image;
}
