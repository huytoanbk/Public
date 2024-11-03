package com.edu.webapp.service.impl;

import com.edu.webapp.config.ImageConfig;
import com.edu.webapp.entity.post.Image;
import com.edu.webapp.entity.post.Post;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.PostMapper;
import com.edu.webapp.model.request.CommentReq;
import com.edu.webapp.model.request.FilterPostReq;
import com.edu.webapp.model.request.PostCreateReq;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import com.edu.webapp.repository.CommentRepository;
import com.edu.webapp.repository.ImageRepository;
import com.edu.webapp.repository.PostRepository;
import com.edu.webapp.repository.UserRepository;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.PostService;
import com.edu.webapp.utils.TimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostsServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final ImageConfig imageConfig;
    private final JwtCommon jwtCommon;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public void createPost(PostCreateReq postCreateReq) {
        String username = jwtCommon.extractUsername();
        Post post = postMapper.postReqToPost(postCreateReq);
        post.setCreatedBy(username);
        post.setUpdatedBy(username);
        postRepository.save(post);
        for (MultipartFile file : postCreateReq.getImages()) {
            if (file.isEmpty()) throw new ValidateException(ErrorCodes.IMAGE_VALID);
            String contentType = file.getContentType();
            if (!imageConfig.isAllowedImageType(contentType)) {
                throw new ValidateException(ErrorCodes.IMAGE_VALID);
            }
            try {
                Image image = new Image();
                image.setImage(file.getBytes());
                image.setPost(post);
                imageRepository.save(image);
            } catch (Exception e) {
                throw new ValidateException(ErrorCodes.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public Page<PostRes> search(FilterPostReq filterPostReq) {
        Pageable pageable = PageRequest.of(filterPostReq.getPage(), filterPostReq.getSize());
        Page<Post> posts = postRepository.findAll(pageable);
        List<PostRes> postRes = postMapper.postsToPosts(posts.getContent());
        return new PageImpl<>(postRes, pageable, posts.getTotalElements());
    }

    @Override
    public PostRes getPostById(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        post.setView(post.getView() + 1);
        postRepository.save(post);
        PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
        User user = userRepository.findById(jwtCommon.extractUsername()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        userPostRes.setTotalPost(postRepository.countByCreatedBy(user.getEmail()));
        userPostRes.setId(user.getId());
        userPostRes.setFullName(user.getFullName());
        userPostRes.setPhone(user.getPhone());
        userPostRes.setEmail(user.getEmail());
        userPostRes.setUptime(TimeUtils.formatTimeDifference(user.getUptime(), OffsetDateTime.now()));
        userPostRes.setDateOfJoin(TimeUtils.formatTimeDifference(user.getCreatedAt(), OffsetDateTime.now()));
        return postMapper.postToPostRes(post);
    }

    @Override
    public CommentRes createComment(CommentReq commentReq) {
        return null;
    }

    @Override
    public Page<PostUserRes> searchPostUser(Integer page, Integer size, String key) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        String username = jwtCommon.extractUsername();
        Page<Post> posts = postRepository.findByCreatedByAndContentContaining(username, key, pageable);
        List<PostUserRes> postUserResList = postMapper.postsToPostsUsers(posts.getContent());
        return new PageImpl<>(postUserResList, pageable, posts.getTotalElements());
    }
}
