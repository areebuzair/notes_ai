package com.iut.notesai.repository;

import com.iut.notesai.model.entity.FileData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface FileDataRepository extends JpaRepository<FileData, Long> {
    @Query("select f.name from FileData f where f.userId=:userId")
    List<String> findUserUploads(@Param("userId") Long userId);


    FileData getFileDataByFilePath(String filePath);
}
