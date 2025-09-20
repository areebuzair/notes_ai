package com.iut.notesai.service;

import com.iut.notesai.model.entity.FileData;
import com.iut.notesai.repository.FileDataRepository;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileStorageService {
    @Autowired
    private FileDataRepository fileDataRepository;

    private final String FOLDER_PATH = "D:/Uploads/";

    public void deleteUserFolder(long userId) {
        String userFolderPath = FOLDER_PATH + userId + "/";
        File userFolder = new File(userFolderPath);
        try {
            FileUtils.deleteDirectory(userFolder);
        } catch (IOException e) {
            throw new RuntimeException("User folder could not be deleted!", e);
        }

        fileDataRepository.deleteByUserId(userId);
    }


    public String uploadFileToFileSystem(MultipartFile file, long userID) throws IOException {
        // Create user folder if it doesn't exist
        String userFolderPath = FOLDER_PATH + userID + "/";
        File userFolder = new File(userFolderPath);
        if (!userFolder.exists()) {
            if (!userFolder.mkdirs())
                return "Folder could not be created";
        }

        String filePath = userFolderPath + file.getOriginalFilename();

        file.transferTo(new File(filePath));

        FileData fileData = fileDataRepository.save(FileData.builder()
                .name(file.getOriginalFilename())
                .type(file.getContentType())
                .filePath(filePath)
                .userId(userID).build());


        if (fileData != null) {
            return "file uploaded successfully : " + filePath;
        }
        return null;
    }

    public String getFilePath(String fileName, Long userID) throws IOException {
        return FOLDER_PATH + userID + "/" + fileName;
    }

    public String getFileType(String filePath) throws IOException {
        return fileDataRepository.getFileDataByFilePath(filePath).getType();
    }


    public byte[] downloadFileFromFileSystem(String fileName, Long userID) throws IOException {
        String filePath = getFilePath(fileName, userID);
        byte[] files = Files.readAllBytes(new File(filePath).toPath());
        return files;
    }

    public List<String> getUserFiles(Long userID) {
        return fileDataRepository.findUserUploads(userID);
    }

    public List<String> searchUserFiles(Long userId, String keyword) throws IOException {
        List<String> allFiles = getUserFiles(userId); // assumes this method returns List<String> of filenames
        return allFiles.stream()
                .filter(name -> name.toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

}
