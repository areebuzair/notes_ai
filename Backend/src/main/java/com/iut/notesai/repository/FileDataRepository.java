package com.iut.notesai.repository;

import com.iut.notesai.model.entity.FileData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface FileDataRepository extends JpaRepository<FileData, Long> {
    @Query("select f.name from FileData f where f.userId=:userId")
    List<String> findUserUploads(@Param("userId") Long userId);


    @Transactional
    @Modifying
    void deleteByUserId(Long userId);


    FileData getFileDataByFilePath(String filePath);
}
