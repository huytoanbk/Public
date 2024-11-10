package com.edu.webapp.model.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentPostSearchReq {
    private String postId;
    @JsonFormat(pattern = "dd-MM-yyyy'T'HH:mm:ssXXX")
    private OffsetDateTime commentTime;
}
