package com.iut.notesai.controller;

import com.iut.notesai.repository.UserRepository;
import com.iut.notesai.security.JwtUtil;
import com.iut.notesai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    @Autowired
    private JwtUtil jwtUtil;

    private final GeminiService geminiService;

    @GetMapping("/all")
    public String allAccess() {
        return "All access";
    }

    @GetMapping("/user")
    public String userAccess(@RequestHeader("Authorization") String token, @RequestHeader String prompt) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserIdFromToken(token);
        return username + " with ID = " + userId + " asked " + prompt + ".\n>>>" + geminiService.askGemini(prompt);
    }
}