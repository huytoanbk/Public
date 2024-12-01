package com.edu.webapp.service;

import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface PostService {
    void createPost(PostCreateReq postCreateReq);

    Page<PostRes> search(FilterPostReq filterPostReq) throws IOException;

    PostRes getPostById(String id);

    CommentRes createComment(CommentReq commentReq);

    Page<PostRes> searchPostUser(Integer page, Integer size, String key, ActiveStatus status);
    Page<PostRes> searchPostAdmin(Integer page, Integer size, String key, ActiveStatus status);

    Page<CommentRes> getListCommentPost(CommentPostSearchReq commentPostSearchReq);

    PostRes updatePost(PostUpdateReq postUpdateReq);

    void likePost(String id);

    Page<PostRes> listPostLike(Integer page, Integer size);

    Page<PostRes> recommend() throws IOException;

    PostRes updatePostStatus(PostUpdateStatusReq postUpdateStatusReq);

    List<PostRes> top10Comment();

    List<PostRes> top10Like();
}
