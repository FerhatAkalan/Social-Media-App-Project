package com.social.ws.file.vm;

import com.social.ws.file.FileAttachment;
import lombok.Data;

@Data
public class FileAttachmentVM {

    private String name;

    private String fileType;

    public FileAttachmentVM(FileAttachment fileAttachment) {
        this.setName(fileAttachment.getName());
        this.fileType = fileAttachment.getFileType();
    }
}
