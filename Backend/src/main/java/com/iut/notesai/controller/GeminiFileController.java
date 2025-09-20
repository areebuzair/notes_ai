package com.iut.notesai.controller;

import com.google.genai.Client;
import com.google.genai.types.File;
import com.iut.notesai.model.GeminiFileURIObject;
import com.iut.notesai.model.GeminiFileUploadObject;
import com.iut.notesai.security.JwtUtil;
import com.iut.notesai.service.FileStorageService;
import com.iut.notesai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.genai.types.Part;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ai/files/")
@RequiredArgsConstructor
public class GeminiFileController {

    @Autowired
    private JwtUtil jwtUtil;

    private final GeminiService geminiService;
    private final FileStorageService fileStorageService;
    @Autowired
    private Client client;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFileToGemini(@RequestHeader("Authorization") String token, @RequestBody GeminiFileUploadObject geminiFileUploadObject) throws IOException {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        String fileName = geminiFileUploadObject.getFileName();
        String filePath = fileStorageService.getFilePath(fileName, userId);
        String fileType = fileStorageService.getFileType(filePath);

        File uploadedFile = geminiService.getFileURI(filePath, fileName, fileType).orElse(null);

        if (uploadedFile == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        GeminiFileURIObject geminiFileURIObject = new GeminiFileURIObject(
                uploadedFile.uri().orElse(""),
                uploadedFile.mimeType().orElse("")
        );


        return ResponseEntity.status(HttpStatus.OK)
                .body(
                        geminiFileURIObject
                );
    }

    @GetMapping("/summary")
    String getGeminiFileSummary(GeminiFileURIObject geminiFileURIObject) {
        String URI = geminiFileURIObject.getUri();
        String fileType = geminiFileURIObject.getFileType();


        return geminiService.summarizeFile(URI, fileType);
    }

    @GetMapping("/generate_questions")
    String generate_questions(GeminiFileURIObject geminiFileURIObject) {
        String URI = geminiFileURIObject.getUri();
        String fileType = geminiFileURIObject.getFileType();


        return geminiService.generateQuestions(URI, fileType);
    }
}