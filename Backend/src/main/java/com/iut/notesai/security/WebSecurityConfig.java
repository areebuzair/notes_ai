package com.iut.notesai.security;

import org.springframework.http.HttpMethod;
import com.iut.notesai.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class WebSecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF + CORS for APIs (configure CORS properly if needed)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults()) // ✅ enable CORS with our bean below

                // Handle unauthorized requests
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(unauthorizedHandler)
                )

                // Stateless session (no cookies)
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Authorization rules
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // Public endpoints
                                .requestMatchers(
                                        "/api/auth/**",
                                        "/api/test/all",
                                        "/swagger-ui.html",
                                        "/swagger-ui-testing.html",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/redoc.html",
                                        "/ws/**",
                                        "/api/chat/**",
                                        "/api/aws/download/**",
                                        "/api/aws/upload",
                                        "/api/utils/getAppVersionByOS/**",
                                        "/api/notifications/sendSingleNotification",
                                        "/actuator/**",
                                        "/api/deepLink/**",
                                        "/api/user/ping/**"
                                ).permitAll()

                                // ✅ Allow GET requests to posts publicly
                                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()

                                // 🔒 Everything else requires authentication
                                .anyRequest().authenticated()
                );

        // Add JWT filter
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
