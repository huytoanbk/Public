package com.edu.webapp.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentReq {
    private String postId;
    private String userId;
    private String comment;
    private String userTo;
}
