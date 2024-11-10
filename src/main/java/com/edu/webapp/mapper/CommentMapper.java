package com.edu.webapp.mapper;

import com.edu.webapp.entity.post.Comment;
import com.edu.webapp.model.request.CommentReq;
import com.edu.webapp.model.response.CommentRes;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment comentRequestToComment(CommentReq commentReq);

    CommentRes commentToCommentRes(Comment comment);
}
