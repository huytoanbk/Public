package com.edu.webapp.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Report4Res {
    private List<String> time;
    private List<String> comment;
    private List<String> like;
}
