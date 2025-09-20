package com.iut.notesai.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GeminiFileAnalysisFromUser extends GeminiFileURIObject{
    private String explanation;
}
