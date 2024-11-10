package com.edu.webapp.service;

import com.edu.webapp.model.request.CommentPostSearchReq;
import com.edu.webapp.model.request.CommentReq;
import com.edu.webapp.model.request.FilterPostReq;
import com.edu.webapp.model.request.PostCreateReq;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import org.springframework.data.domain.Page;

public interface PostService {
    void createPost(PostCreateReq postCreateReq);

    Page<PostRes> search(FilterPostReq filterPostReq);

    PostRes getPostById(String id);

    CommentRes createComment(CommentReq commentReq);

    Page<PostUserRes> searchPostUser(Integer page, Integer size, String key);

    Page<CommentRes> getListCommentPost(CommentPostSearchReq commentPostSearchReq);
}
