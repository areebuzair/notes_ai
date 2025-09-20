package com.iut.notesai.repository;

import com.iut.notesai.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT u.id FROM User u WHERE u.username = :username")
    Long findIdByUsername(String username);

    @Transactional
    @Modifying
    void deleteByUsername(String username);
}