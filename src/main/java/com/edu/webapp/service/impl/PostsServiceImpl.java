package com.edu.webapp.service.impl;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.json.JsonData;
import com.edu.webapp.entity.post.*;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.CommentMapper;
import com.edu.webapp.mapper.PostMapper;
import com.edu.webapp.model.dto.PostCommentDto;
import com.edu.webapp.model.dto.PostLikeDto;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.enums.NotiStatus;
import com.edu.webapp.model.page.CustomPage;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.repository.*;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.PostService;
import com.edu.webapp.utils.TimeUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostsServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final ImageRepository imageRepository;
    private final CommentRepository commentRepository;
    private final JwtCommon jwtCommon;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final LikePostRepository likePostRepository;
    private final PostElsRepository postElsRepository;
    private final ElasticsearchService<PostEls> elasticsearchService;
    private final LogSearchRepository logSearchRepository;
    private final NotiPostRepository notiPostRepository;
    private final JavaMailSender mailSender;

    @Transactional
    @Override
    public void createPost(PostCreateReq postCreateReq) {
        String username = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        if (user.getPostVip() == null || user.getPostVip() < 1)
            throw new ValidateException(ErrorCodes.USER_NOT_RECHARGE_VIP);
        Post post = postMapper.postReqToPost(postCreateReq);
        post.setActive(ActiveStatus.PENDING);
        post.setCreatedBy(username);
        post.setUpdatedBy(username);
        postRepository.save(post);
        for (String file : postCreateReq.getImages()) {
            Image image = new Image();
            image.setImage(file);
            image.setPost(post);
            imageRepository.save(image);
        }
        user.setPostVip(user.getPostVip() - 1);
        userRepository.save(user);
    }

    @Override
    public Page<PostRes> search(FilterPostReq filterPostReq) throws IOException {
        Pageable pageable = PageRequest.of(filterPostReq.getPage(), filterPostReq.getSize());
        Page<PostEls> posts = elasticsearchService.search("post", buildBoolQuery(filterPostReq), filterPostReq.getPage(), filterPostReq.getSize(), PostEls.class, getOrderSort(filterPostReq.getFieldSort()));
        List<String> postId = posts.stream().map(PostEls::getId).toList();
        List<Post> postList = postRepository.findByIdIn(postId);
        postList.sort(Comparator.comparing(post -> postId.indexOf(post.getId())));
        List<PostRes> postRes = postMapper.postsToPosts(postList);
        HashMap<String, Integer> mapCount = new HashMap<>();
        Set<String> emails;
        emails = postRes.stream().map(PostRes::getCreatedBy).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails).stream().collect(Collectors.toMap(User::getEmail, user -> user));
        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        String username = jwtCommon.extractUsername();
        Map<String, Boolean> mapLikePost;
        mapLikePost = (username != null) ? likePostRepository.findLikePostByUserId(userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST)).getId()).stream().collect(Collectors.toMap(LikePost::getPostId, likePost -> true)) : new HashMap<>();
        for (PostRes post : postRes) {
            PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
            User user = userMap.get(post.getCreatedBy());
            userPostRes.setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.setId(Objects.requireNonNull(user).getId());
            buildUserPostRes(userPostRes, user);
            post.setUserPostRes(userPostRes);
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
            post.setLike(mapLikePost.getOrDefault(post.getId(), false));
        }
        if (username != null && !StringUtils.isEmpty(filterPostReq.getKey())) {
            LogSearch logSearch = new LogSearch();
            logSearch.setUserId(username);
            logSearch.setKeySearch(filterPostReq.getKey());
            logSearchRepository.save(logSearch);
        }
        return new PageImpl<>(postRes, pageable, posts.getTotalElements());
    }

    private void buildUserPostRes(PostRes.UserPostRes userPostRes, User user) {
        userPostRes.setAvatar(user.getAvatar());
        userPostRes.setFullName(user.getFullName());
        userPostRes.setPhone(user.getPhone());
        userPostRes.setEmail(user.getEmail());
        userPostRes.setUptime(TimeUtils.formatTimeDifference(user.getUptime(), OffsetDateTime.now()));
        userPostRes.setDateOfJoin(TimeUtils.formatTimeDifference(user.getCreatedAt(), OffsetDateTime.now()));
    }

    @Override
    public PostRes getPostById(String id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        post.setView(post.getView() + 1);
        postRepository.save(post);
        User user = userRepository.findByEmail(post.getCreatedBy()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        PostRes.UserPostRes userPostRes = buildUserPostRes(user);
        PostRes postRes = postMapper.postToPostRes(post);
        postRes.setUserPostRes(userPostRes);
        postRes.setUptime(TimeUtils.formatTimeDifference(postRes.getUpdatedAt(), OffsetDateTime.now()));
        postRes.setDateOfJoin(TimeUtils.formatTimeDifference(postRes.getCreatedAt(), OffsetDateTime.now()));
        return postRes;
    }

    @Override
    public CommentRes createComment(CommentReq commentReq) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        Comment comment = commentMapper.comentRequestToComment(commentReq);
        comment.setUserId(user.getId());
        commentRepository.save(comment);
        CommentRes commentRes = commentMapper.commentToCommentRes(comment);
        if (!postRepository.existsById(commentReq.getPostId())) throw new ValidateException(ErrorCodes.POST_NOT_EXIST);
        commentRes.setAvatar(user.getAvatar());
        commentRes.setFullName(user.getFullName());
        commentRes.setUserId(user.getId());
        commentRes.setEmail(email);
        simpMessagingTemplate.convertAndSend("/topic/comments/" + comment.getPostId(), commentRes);
        return commentRes;
    }

    @Override
    public Page<PostRes> searchPostUser(Integer page, Integer size, String key, ActiveStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        String username = jwtCommon.extractUsername();
        Page<Post> postList;
        if (status == null) {
            postList = postRepository.findByCreatedByAndContentContaining(username, key, pageable);
        } else {
            postList = postRepository.findByCreatedByAndContentContainingAndActive(username, key, status, pageable);
        }
        List<PostRes> postRes = postMapper.postsToPosts(postList.getContent());
        HashMap<String, Integer> mapCount = new HashMap<>();
        Set<String> emails;
        emails = postRes.stream().map(PostRes::getCreatedBy).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails).stream().collect(Collectors.toMap(User::getEmail, user -> user));
        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        Map<String, Boolean> mapLikePost;
        mapLikePost = (username != null) ? likePostRepository.findLikePostByUserId(userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST)).getId()).stream().collect(Collectors.toMap(LikePost::getPostId, likePost -> true)) : new HashMap<>();
        for (PostRes post : postRes) {
            PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
            User user = userMap.get(post.getCreatedBy());
            userPostRes.setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.setId(Objects.requireNonNull(user).getId());
            buildUserPostRes(userPostRes, user);
            post.setUserPostRes(userPostRes);
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
            post.setLike(mapLikePost.getOrDefault(post.getId(), false));
        }
        return new PageImpl<>(postRes, pageable, postList.getTotalElements());
    }

    @Override
    public Page<PostRes> searchPostAdmin(Integer page, Integer size, String key, ActiveStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        Page<Post> postList;
        if (status == null) {
            postList = postRepository.findByContentContaining(key, pageable);
        } else {
            postList = postRepository.findByContentContainingAndActive(key, status, pageable);
        }
        List<PostRes> postRes = postMapper.postsToPosts(postList.getContent());
        HashMap<String, Integer> mapCount = new HashMap<>();
        Set<String> emails;
        emails = postRes.stream().map(PostRes::getCreatedBy).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails).stream().collect(Collectors.toMap(User::getEmail, user -> user));
        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        for (PostRes post : postRes) {
            PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
            User user = userMap.get(post.getCreatedBy());
            userPostRes.setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.setId(Objects.requireNonNull(user).getId());
            buildUserPostRes(userPostRes, user);
            post.setUserPostRes(userPostRes);
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
        }
        return new PageImpl<>(postRes, pageable, postList.getTotalElements());
    }

    @Override
    public Page<CommentRes> getListCommentPost(CommentPostSearchReq commentPostSearchReq) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        Page<Comment> page;
        if (commentPostSearchReq.getCommentTime() == null)
            page = commentRepository.findByPostId(commentPostSearchReq.getPostId(), pageable);
        else
            page = commentRepository.findByPostIdAndCreatedAtBefore(commentPostSearchReq.getPostId(), commentPostSearchReq.getCommentTime(), pageable);
        List<Comment> comments = page.getContent();
        Set<String> ids = comments.stream().map(Comment::getUserId).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByIdIn(ids).stream().collect(Collectors.toMap(User::getId, user -> user));
        List<CommentRes> commentResList = new ArrayList<>();
        for (Comment comment : comments) {
            CommentRes commentRes = commentMapper.commentToCommentRes(comment);
            User user = userMap.get(comment.getUserId());
            commentRes.setAvatar(user.getAvatar());
            commentRes.setFullName(user.getFullName());
            commentRes.setUserId(user.getId());
            commentRes.setEmail(user.getEmail());
            commentResList.add(commentRes);
        }
        return new CustomPage<>(commentResList, pageable, 0L, page.getTotalElements() > 10);
    }

    @Override
    public PostRes updatePost(PostUpdateReq postUpdateReq) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        if (user.getRechargeVip() == null || LocalDate.now().isAfter(user.getRechargeVip()))
            throw new ValidateException(ErrorCodes.USER_NOT_RECHARGE_VIP);
        Post post = postRepository.findById(postUpdateReq.getPostId()).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        if (!post.getCreatedBy().equals(user.getEmail()))
            throw new ValidateException(ErrorCodes.YOU_NOT_PERMISSION_UPDATE);
        post.setTitle(postUpdateReq.getTitle());
        post.setContent(postUpdateReq.getContent());
        post.setPrice(postUpdateReq.getPrice());
        post.setDeposit(postUpdateReq.getDeposit());
        post.setAddress(postUpdateReq.getAddress());
        post.setAcreage(postUpdateReq.getAcreage());
        post.setStatusRoom(postUpdateReq.getStatusRoom());
        post.setContact(postUpdateReq.getContact());
        post.setImages(post.getImages());
        post.setProvince(postUpdateReq.getProvince());
        post.setDistrict(postUpdateReq.getDistrict());
        post.setLongitude(postUpdateReq.getLongitude());
        post.setLatitude(postUpdateReq.getLatitude());
        post.setActive(postUpdateReq.getActive());
        post.setType(postUpdateReq.getType());
        post.setUpdatedBy(email);
        post.setUpdatedAt(OffsetDateTime.now());
        postRepository.save(post);
        if (post.getActive().equals(ActiveStatus.ACTIVE)) {
            try {
                postElsRepository.deleteById(post.getId());
            } catch (Exception ignored) {
            }
        }
        PostEls postEls = postMapper.postToPostEls(post);
        postEls.setVip(0);
        if (user.getRechargeVip() != null && !LocalDate.now().isAfter(user.getRechargeVip())) {
            postEls.setVip(1);
        }
        postElsRepository.save(postEls);
        PostRes postRes = postMapper.postToPostRes(post);
        PostRes.UserPostRes userPostRes = buildUserPostRes(user);
        postRes.setUserPostRes(userPostRes);
        postRes.setUptime(TimeUtils.formatTimeDifference(postRes.getUpdatedAt(), OffsetDateTime.now()));
        postRes.setDateOfJoin(TimeUtils.formatTimeDifference(postRes.getCreatedAt(), OffsetDateTime.now()));
        return postRes;
    }

    @Override
    public void likePost(String id) {
        String email = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        Post post = postRepository.findById(id).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        LikePost likePost = likePostRepository.findLikePostByPostIdAndUserId(post.getId(), user.getId());
        if (likePost == null) {
            likePost = new LikePost();
            likePost.setUserId(user.getId());
            likePost.setPostId(post.getId());
            likePostRepository.save(likePost);
        } else likePostRepository.delete(likePost);
    }

    @Override
    public Page<PostRes> listPostLike(Integer page, Integer size) {
        String username = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<LikePost> likePosts = likePostRepository.findLikePostByUserId(user.getId(), pageable);
        List<String> listPostIds = likePosts.stream().map(LikePost::getPostId).toList();
        List<Post> posts = postRepository.findByIdIn(listPostIds);
        List<PostRes> postRes = postMapper.postsToPosts(posts);
        Map<String, Integer> mapCount = new HashMap<>();
        Set<String> emails = postRes.stream().map(PostRes::getCreatedBy).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails).stream().collect(Collectors.toMap(User::getEmail, u -> u));
        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        Map<String, Boolean> mapLikePost = (username != null) ? likePostRepository.findLikePostByUserId(userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST)).getId()).stream().collect(Collectors.toMap(LikePost::getPostId, likePost -> true)) : new HashMap<>();
        for (PostRes post : postRes) {
            AtomicReference<PostRes.UserPostRes> userPostRes = new AtomicReference<>(new PostRes.UserPostRes());
            User u = userMap.get(post.getCreatedBy());
            if (u == null) {
                throw new ValidateException(ErrorCodes.USER_NOT_EXIST);
            }
            userPostRes.get().setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.get().setId(user.getId());
            userPostRes.get().setAvatar(user.getAvatar());
            userPostRes.get().setFullName(user.getFullName());
            userPostRes.get().setPhone(user.getPhone());
            userPostRes.get().setEmail(user.getEmail());
            userPostRes.get().setUptime(TimeUtils.formatTimeDifference(user.getUptime(), OffsetDateTime.now()));
            userPostRes.get().setDateOfJoin(TimeUtils.formatTimeDifference(user.getCreatedAt(), OffsetDateTime.now()));
            post.setUserPostRes(userPostRes.get());
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
            post.setLike(mapLikePost.getOrDefault(post.getId(), false));
        }
        return new PageImpl<>(postRes, pageable, likePosts.getTotalElements());
    }

    @Override
    public Page<PostRes> recommend() throws IOException {
        String username = jwtCommon.extractUsername();
        List<Post> list;
        if (username == null) {
            list = postRepository.findRandomRecommend();
        } else {
            List<String> keySearch = logSearchRepository.findByUserId(username);
            if (keySearch == null) {
                Page<PostEls> posts = elasticsearchService.search("post", buildBoolQueryRecommend(keySearch), 0, 10, PostEls.class, new HashMap<>());
                List<String> postId = posts.stream().map(PostEls::getId).toList();
                list = postRepository.findByIdIn(postId);
            } else list = new ArrayList<>();
            List<Post> randomRecommend = postRepository.findRandomRecommend();
            if (list.size() < 10) {
                int min = Math.min(randomRecommend.size(), 10 - randomRecommend.size());
                List<Post> recommend = randomRecommend.subList(0, min);
                list.addAll(recommend);
            }
        }
        List<PostRes> postRes = postMapper.postsToPosts(list);
        HashMap<String, Integer> mapCount = new HashMap<>();
        Set<String> emails;
        emails = postRes.stream().map(PostRes::getCreatedBy).collect(Collectors.toSet());
        Map<String, User> userMap = userRepository.findAllByEmailIn(emails).stream().collect(Collectors.toMap(User::getEmail, user -> user));
        emails.forEach(email -> mapCount.put(email, postRepository.countByCreatedBy(email)));
        Map<String, Boolean> mapLikePost;
        mapLikePost = (username != null) ? likePostRepository.findLikePostByUserId(userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST)).getId()).stream().collect(Collectors.toMap(LikePost::getPostId, likePost -> true)) : new HashMap<>();
        for (PostRes post : postRes) {
            PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
            User user = userMap.get(post.getCreatedBy());
            userPostRes.setTotalPost(mapCount.getOrDefault(user.getEmail(), 0));
            userPostRes.setId(Objects.requireNonNull(user).getId());
            buildUserPostRes(userPostRes, user);
            post.setUserPostRes(userPostRes);
            post.setUptime(TimeUtils.formatTimeDifference(post.getUpdatedAt(), OffsetDateTime.now()));
            post.setDateOfJoin(TimeUtils.formatTimeDifference(post.getCreatedAt(), OffsetDateTime.now()));
            post.setLike(mapLikePost.getOrDefault(post.getId(), false));
        }
        return new PageImpl<>(postRes, PageRequest.of(0, postRes.size()), postRes.size());
    }

    @Override
    public PostRes updatePostStatus(PostUpdateStatusReq postUpdateStatusReq) {
        Post post = postRepository.findById(postUpdateStatusReq.getPostId()).orElseThrow(() -> new ValidateException(ErrorCodes.POST_NOT_EXIST));
        post.setActive(postUpdateStatusReq.getActive());
        postRepository.save(post);
        if (postUpdateStatusReq.getActive().equals(ActiveStatus.ACTIVE)) {
            PostEls postEls = postMapper.postToPostEls(post);
            OffsetDateTime offsetDateTime = OffsetDateTime.now();
            postEls.setCreatedAt(Timestamp.from(offsetDateTime.toInstant()));
            postEls.setUpdatedAt(Timestamp.from(offsetDateTime.toInstant()));
            postElsRepository.save(postEls);
            notiPost(post);
        } else {
            postElsRepository.deleteById(post.getId());
        }
        User user = userRepository.findByEmail(post.getCreatedBy()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        PostRes.UserPostRes userPostRes = buildUserPostRes(user);
        PostRes postRes = postMapper.postToPostRes(post);
        postRes.setUserPostRes(userPostRes);
        postRes.setUptime(TimeUtils.formatTimeDifference(postRes.getUpdatedAt(), OffsetDateTime.now()));
        postRes.setDateOfJoin(TimeUtils.formatTimeDifference(postRes.getCreatedAt(), OffsetDateTime.now()));
        return postRes;
    }

    @Override
    public List<PostRes> top10Comment() {
        List<PostCommentDto> postCommentDtos = commentRepository.findTop10Comments();
        List<PostRes> postResList = new ArrayList<>();
        for (PostCommentDto postCommentDto : postCommentDtos) {
            PostRes postRes = getPostById(postCommentDto.getPostId());
            postRes.setTotalComment(postCommentDto.getTotalComment());
            postResList.add(postRes);
        }
        return postResList;
    }

    @Override
    public List<PostRes> top10Like() {
        List<PostLikeDto> postLikeDtos = likePostRepository.findTop10Like();
        List<PostRes> postResList = new ArrayList<>();
        for (PostLikeDto postLikeDto : postLikeDtos) {
            PostRes postRes = getPostById(postLikeDto.getPostId());
            postRes.setTotalComment(postLikeDto.getTotalLike());
            postResList.add(postRes);
        }
        return postResList;
    }

    private PostRes.UserPostRes buildUserPostRes(User user) {
        PostRes.UserPostRes userPostRes = new PostRes.UserPostRes();
        userPostRes.setTotalPost(postRepository.countByCreatedBy(user.getEmail()));
        userPostRes.setId(user.getId());
        buildUserPostRes(userPostRes, user);
        return userPostRes;
    }


    public BoolQuery buildBoolQuery(FilterPostReq filterPostReq) {
        return BoolQuery.of(b -> {
            List<Query> mustQueries = new ArrayList<>();

            // Range for price
            if (filterPostReq.getPrice() != null) {
                mustQueries.add(Query.of(m -> m.range(r -> r.field("price")
                        .gte(JsonData.of(filterPostReq.getPrice().getFrom()))
                        .lte(JsonData.of(
                                filterPostReq.getPrice().getTo() != null
                                        ? filterPostReq.getPrice().getTo()
                                        : filterPostReq.getPrice().getFrom() + 100000000)) // Default upper bound
                )));
            }

            // Range for acreage
            if (filterPostReq.getAcreage() != null) {
                mustQueries.add(Query.of(m -> m.range(r -> r.field("acreage")
                        .gte(JsonData.of(filterPostReq.getAcreage().getFrom()))
                        .lte(JsonData.of(
                                filterPostReq.getAcreage().getTo() != null
                                        ? filterPostReq.getAcreage().getTo()
                                        : filterPostReq.getAcreage().getFrom() + 500)) // Default upper bound
                )));
            }

            List<Query> shouldQueries = new ArrayList<>();
            String keyQuery = StringUtils.isEmpty(filterPostReq.getKey()) ? "*" : filterPostReq.getKey();

            // Improved wildcard query, adding "*" around the keyQuery only if needed
            if (!keyQuery.equals("*")) {
                shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("content").value("*" + keyQuery + "*"))));
                shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("title").value("*" + keyQuery + "*"))));
            }

            List<Query> filterQueries = new ArrayList<>();

            // Match queries with exact values (using term for exact matching)
            if (filterPostReq.getType() != null && !filterPostReq.getType().equals("all")) {
                filterQueries.add(Query.of(f -> f.term(t -> t.field("type").value(filterPostReq.getType()))));
            }

            if (filterPostReq.getProvince() != null) {
                // Use 'term' for exact match on 'province'
                filterQueries.add(Query.of(f -> f.term(t -> t.field("province").value(filterPostReq.getProvince()))));
            }

            if (filterPostReq.getDistrict() != null) {
                // Use 'term' for exact match on 'district'
                filterQueries.add(Query.of(f -> f.term(t -> t.field("district").value(filterPostReq.getDistrict()))));
            }

            if (filterPostReq.getStatusRoom() != null) {
                // Use 'term' for exact match on 'statusRoom'
                filterQueries.add(Query.of(f -> f.term(t -> t.field("statusRoom").value(filterPostReq.getStatusRoom()))));
            }

            return b.must(mustQueries)
                    .should(shouldQueries)
                    .filter(filterQueries);
        });
    }


    private Map<String, SortOrder> getOrderSort(String value) {
        Map<String, SortOrder> map = new HashMap<>();
//        map.put("vip", SortOrder.Desc);
        if (value == null) {
            map.put("updatedAt", SortOrder.Desc);
            map.put("createdAt", SortOrder.Desc);
            return map;
        }
        switch (value) {
            case "newest":
                map.put("updatedAt", SortOrder.Desc);
                map.put("createdAt", SortOrder.Desc);
                break;
            case "priceLow":
                map.put("price", SortOrder.Asc);
                break;
            case "priceHigh":
                map.put("price", SortOrder.Desc);
                break;
        }
        return map;
    }


    public BoolQuery buildBoolQueryRecommend(List<String> values) {
        return BoolQuery.of(b -> {
            List<Query> shouldQueries = new ArrayList<>();
            for (String value : values) {
                shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("content").value("*" + value + "*"))));
                shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("title").value("*" + value + "*"))));
            }
            return b.should(shouldQueries).minimumShouldMatch("1");
        });
    }

    @Async(value = "taskExecutorNoti")
    public void notiPost(Post post) {
        try {
            Thread.sleep(10000);
            List<User> users = userRepository.findAllByNotiStatus(NotiStatus.ACTIVE);
            for (User user : users) {
                if (notiPostRepository.existsByPostIdAndUserId(post.getId(), user.getId()) || user.getEmail().equals(post.getCreatedBy()))
                    continue;
                NotiPost notiPost = new NotiPost();
                notiPost.setPostId(post.getId());
                notiPost.setUserId(user.getId());
                sendPostNotificationWithEmbeddedImages(user.getEmail(), post, postMapper.convertImages(post.getImages()), "http://localhost:3000/post/" + post.getId());
                notiPostRepository.save(notiPost);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }


    public void sendPostNotificationWithEmbeddedImages(String toEmail, Post post, List<String> imageUrls, String url) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        // Cài đặt thông tin email
        helper.setTo(toEmail);
        helper.setSubject("Thông báo về bài đăng: " + post.getTitle());
        helper.setText(constructEmailBody(post, imageUrls, url), true);

        // Gửi email
        mailSender.send(mimeMessage);
    }

    private String constructEmailBody(Post post, List<String> imageUrls, String postUrl) {
        StringBuilder imagesHtml = new StringBuilder();
        for (String imageUrl : imageUrls) {
            imagesHtml.append(String.format(
                    "<a href='%s' target='_blank' style='text-decoration:none;'>"
                            + "<img src='%s' alt='Image' style='max-width:100%%; height:auto; margin:10px 0;' />"
                            + "</a>",
                    postUrl, imageUrl));
        }

        return String.format(
                "<html>" +
                        "<body>" +
                        "<h1>Thông tin bài đăng</h1>" +
                        "<p><strong>Tiêu đề:</strong> <a href='%s' target='_blank' style='text-decoration:none; color:#2a7dfd;'>%s</a></p>" +
                        "<p><strong>Nội dung:</strong> %s</p>" +
                        "<p><strong>Giá:</strong> %.2f VND</p>" +
                        "<p><strong>Tiền đặt cọc:</strong> %.2f VND</p>" +
                        "<p><strong>Địa chỉ:</strong> %s</p>" +
                        "<p><strong>Diện tích:</strong> %.2f m²</p>" +
                        "<p><strong>Tỉnh/Thành phố:</strong> %s</p>" +
                        "<p><strong>Quận/Huyện:</strong> %s</p>" +
                        "<p><strong>Trạng thái phòng:</strong> %s</p>" +
                        "<p><strong>Loại phòng:</strong> %s</p>" +
                        "<p><strong>Liên hệ:</strong> %s</p>" +
                        "<p><strong>Ngày hết hạn:</strong> %s</p>" +
                        "<p><strong>Số lượt xem:</strong> %d</p>" +
                        "<h2>Hình ảnh:</h2>" +
                        "%s" + // Chèn hình ảnh
                        "</body>" +
                        "</html>",
                postUrl, // Link đến bài viết
                post.getTitle(),
                post.getContent(),
                post.getPrice(),
                post.getDeposit(),
                post.getAddress(),
                post.getAcreage(),
                post.getProvince(),
                post.getDistrict(),
                post.getStatusRoom(),
                post.getType(),
                post.getContact(),
                post.getExpirationDate() != null ? post.getExpirationDate().toString() : "Không có",
                post.getView(),
                imagesHtml.toString()
        );
    }

}
