package com.iut.notesai.service;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.genai.Client;
import com.google.genai.types.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GeminiService {
    private final Client client;

    public String askGemini(String prompt) {
        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        return response.text();
    }

    public String summarizeFile(String URI, String fileType) {

        String prompt = "Summarize this file please.";

        Part promptPart = Part.fromText(prompt);
        Part contentPart = Part.fromUri(URI, fileType);

        Content content = Content.builder()
                .parts(List.of(promptPart, contentPart))
                .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        content,
                        null);

        return response.text();
    }

    public Optional<File> getFileURI(String filePath, String fileName, String fileExtension) {
        File fileToUpload = client.files.upload(
                filePath,
                UploadFileConfig.builder().displayName(fileName).mimeType(fileExtension).build()
        );
        return Optional.ofNullable(fileToUpload);
    }

    public String generateQuestions(String uri, String fileType) {

        // Define schema for a single Question object
        Schema questionSchema = Schema.builder()
                .title("Question")
                .type(Type.Known.OBJECT)
                .required("question", "choices", "correct_answer")
                .properties(Map.of(
                        "question", Schema.builder()
                                .type(Type.Known.STRING)
                                .description("The text of the question")
                                .build(),
                        "choices", Schema.builder()
                                .type(Type.Known.ARRAY)
                                .items(Schema.builder()
                                        .type(Type.Known.STRING)
                                        .description("A possible answer choice")
                                        .build())
                                .description("List of possible answer choices")
                                .build(),
                        "correct_answer", Schema.builder()
                                .type(Type.Known.INTEGER)
                                .description("Index of the correct answer in the choices list")
                                .minimum(0.0) // must be non-negative
                                .build()
                ))
                .build();

        // Define schema for a list of questions
        Schema questionsListSchema = Schema.builder()
                .title("QuestionsList")
                .type(Type.Known.ARRAY)
                .items(questionSchema)
                .description("A list of Question objects")
                .build();

        // Set the response schema in GenerateContentConfig
        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .candidateCount(1)
                        .responseSchema(questionsListSchema)
                        .build();


        String prompt = "Generate some multiple choice questions from this file.";

        Part promptPart = Part.fromText(prompt);
        Part contentPart = Part.fromUri(uri, fileType);

        Content content = Content.builder()
                .parts(List.of(promptPart, contentPart))
                .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        content,
                        config);

        return response.text();
    }
}
