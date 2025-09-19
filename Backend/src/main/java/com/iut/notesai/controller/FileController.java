package com.iut.notesai.controller;

import com.iut.notesai.security.JwtUtil;
import com.iut.notesai.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileStorageService service;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(path="/fileSystem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFileToFileSystem(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) throws IOException {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        String uploadFile = service.uploadFileToFileSystem(file, userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(uploadFile);
    }

    @GetMapping("/fileSystem/all")
    public ResponseEntity<List<String>> getUserFiles(@RequestHeader("Authorization") String token) throws IOException {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        return ResponseEntity.status(HttpStatus.OK)
                .body(fileStorageService.getUserFiles(userId));
    }

    @GetMapping("/fileSystem/{fileName}")
    public ResponseEntity<?> downloadFileFromFileSystem(@RequestHeader("Authorization") String token, @PathVariable String fileName) throws IOException {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        byte[] fileData = service.downloadFileFromFileSystem(fileName, userId);
        // Detect content type (fallback to octet-stream if unknown)
        String contentType = Files.probeContentType(Paths.get(fileName));
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(fileData);

    }


    @GetMapping("/fileSystem/search")
    public ResponseEntity<List<String>> searchUserFiles(
            @RequestHeader("Authorization") String token,
            @RequestParam("keyword") String keyword) throws IOException {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        List<String> matchedFiles = fileStorageService.searchUserFiles(userId, keyword);
        return ResponseEntity.ok(matchedFiles);
    }



}
