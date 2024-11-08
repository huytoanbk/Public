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
import java.util.*;
import java.util.stream.Collectors;

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
        for (String file : postCreateReq.getImages()) {
            Image image = new Image();
            image.setImage(file);
            image.setPost(post);
            imageRepository.save(image);
        }
    }

    @Override
    public Page<PostRes> search(FilterPostReq filterPostReq) {
        Pageable pageable = PageRequest.of(filterPostReq.getPage(), filterPostReq.getSize());
        Page<Post> posts = postRepository.findAll(pageable);
        List<PostRes> postRes = postMapper.postsToPosts(posts.getContent());
        Map<String, Integer> mapCount = new HashMap<>();
        Set<String> emails = postRes.stream()
                .map(PostRes::getCreatedBy)
                .collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails)
                .stream()
                .collect(Collectors.toMap(User::getEmail, user -> user));

        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        postRes.forEach(post -> {
            PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
            User user = userMap.get(post.getCreatedBy());
            if (user == null) {
                throw new ValidateException(ErrorCodes.USER_NOT_EXIST);
            }
            userPostRes.setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.setId(user.getId());
            userPostRes.setAvatar(user.getAvatar());
            userPostRes.setFullName(user.getFullName());
            userPostRes.setPhone(user.getPhone());
            userPostRes.setEmail(user.getEmail());
            userPostRes.setUptime(TimeUtils.formatTimeDifference(user.getUptime(), OffsetDateTime.now()));
            userPostRes.setDateOfJoin(TimeUtils.formatTimeDifference(user.getCreatedAt(), OffsetDateTime.now()));
            post.setUserPostRes(userPostRes);
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
        });
        return new PageImpl<>(postRes, pageable, posts.getTotalElements());
    }

    @Override
    public PostRes getPostById(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        post.setView(post.getView() + 1);
        postRepository.save(post);
        PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
        User user = userRepository.findByEmail(post.getCreatedBy()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        userPostRes.setTotalPost(postRepository.countByCreatedBy(user.getEmail()));
        userPostRes.setId(user.getId());
        userPostRes.setAvatar(user.getAvatar());
        userPostRes.setFullName(user.getFullName());
        userPostRes.setPhone(user.getPhone());
        userPostRes.setEmail(user.getEmail());
        userPostRes.setUptime(TimeUtils.formatTimeDifference(user.getUptime(), OffsetDateTime.now()));
        userPostRes.setDateOfJoin(TimeUtils.formatTimeDifference(user.getCreatedAt(), OffsetDateTime.now()));
        PostRes postRes = postMapper.postToPostRes(post);
        postRes.setUserPostRes(userPostRes);
        postRes.setUptime(TimeUtils.formatTimeDifference(postRes.getUpdatedAt(), OffsetDateTime.now()));
        postRes.setDateOfJoin(TimeUtils.formatTimeDifference(postRes.getCreatedAt(), OffsetDateTime.now()));
        return postRes;
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
