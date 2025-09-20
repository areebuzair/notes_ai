package com.iut.notesai.controller;

import com.iut.notesai.model.SignInObject;
import com.iut.notesai.model.User;
import com.iut.notesai.repository.UserRepository;
import com.iut.notesai.security.JwtUtil;
import com.iut.notesai.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FileStorageService fileStorageService;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;

    @PostMapping("/signin")
    public String authenticateUser(@RequestBody SignInObject user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateToken(
                userDetails.getUsername(),
                userRepository.findIdByUsername(userDetails.getUsername())
        );
    }

    @DeleteMapping("/delete_account")
    public String deleteUser(@RequestBody SignInObject user) {
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            user.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = userRepository.findIdByUsername(userDetails.getUsername());

            fileStorageService.deleteUserFolder(userId);
            userRepository.deleteByUsername(userDetails.getUsername());

            return "User successfully deleted";
        }
        catch (Exception e) {
            return "Could not delete user" + e.getMessage();
        }
    }

    @PostMapping("/signup")
    public String registerUser(@RequestBody SignInObject user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Error: Username is already taken!";
        }
        // Create new user's account
        User newUser = new User(
                null,
                user.getUsername(),
                encoder.encode(user.getPassword())
        );
        userRepository.save(newUser);
        return "User registered successfully!";
    }
}