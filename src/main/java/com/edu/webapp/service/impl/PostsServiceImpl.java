package com.edu.webapp.service.impl;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.json.JsonData;
import com.edu.webapp.entity.post.*;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.mapper.CommentMapper;
import com.edu.webapp.mapper.PostMapper;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.page.CustomPage;
import com.edu.webapp.model.request.*;
import com.edu.webapp.model.response.CommentRes;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import com.edu.webapp.repository.*;
import com.edu.webapp.security.JwtCommon;
import com.edu.webapp.service.PostService;
import com.edu.webapp.utils.TimeUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Transactional
    @Override
    public void createPost(PostCreateReq postCreateReq) {
        String username = jwtCommon.extractUsername();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
        if (user.getRechargeVip() == null || LocalDate.now().isAfter(user.getRechargeVip()))
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
        PostEls postEls = postMapper.postToPostEls(post);
        OffsetDateTime offsetDateTime = OffsetDateTime.now();
        postEls.setCreatedAt(Timestamp.from(offsetDateTime.toInstant()));
        postEls.setUpdatedAt(Timestamp.from(offsetDateTime.toInstant()));
        postElsRepository.save(postEls);
    }

    @Override
    public Page<PostRes> search(FilterPostReq filterPostReq) throws IOException {
        Pageable pageable = PageRequest.of(filterPostReq.getPage(), filterPostReq.getSize());
        Page<PostEls> posts = elasticsearchService.search("post", buildBoolQuery(filterPostReq), filterPostReq.getPage(), filterPostReq.getSize(), PostEls.class, getOrderSort(filterPostReq.getFieldSort()));
        List<String> postId = posts.stream().map(PostEls::getId).toList();
        List<Post> postList = postRepository.findByIdIn(postId);
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
    public Page<PostUserRes> searchPostUser(Integer page, Integer size, String key, ActiveStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        String username = jwtCommon.extractUsername();
        Page<Post> posts;
        if (status == null) {
            posts = postRepository.findByCreatedByAndContentContaining(username, key, pageable);
        } else {
            posts = postRepository.findByCreatedByAndContentContainingAndActive(username, key, status, pageable);
        }
        List<PostUserRes> postUserResList = postMapper.postsToPostsUsers(posts.getContent());
        return new PageImpl<>(postUserResList, pageable, posts.getTotalElements());
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
        PostEls postEls = postMapper.postToPostEls(post);
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
    public List<PostRes> recommend() throws IOException {
        String username = jwtCommon.extractUsername();
        List<Post> list;
        if (username == null) {
            list = postRepository.findRandomRecommend();
        } else {
            List<String> keySearch = logSearchRepository.findByUserId(username);
            Page<PostEls> posts = elasticsearchService.search("post", buildBoolQueryRecommend(keySearch), 0, 10, PostEls.class, new HashMap<>());
            List<String> postId = posts.stream().map(PostEls::getId).toList();
            list = postRepository.findByIdIn(postId);
            List<Post> randomRecommend = postRepository.findRandomRecommend();
            if (list.size() < 10) {
                list.addAll(randomRecommend.subList(0, 10 - list.size()));
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
        return List.of();
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
                mustQueries.add(Query.of(m -> m.range(r -> r.field("price").gte(JsonData.of(filterPostReq.getPrice().getFrom())).lte(JsonData.of(filterPostReq.getPrice().getTo() != null ? filterPostReq.getPrice().getTo() : filterPostReq.getPrice().getFrom() + 100000000)) // Default upper bound
                )));
            }

            // Range for acreage
            if (filterPostReq.getAcreage() != null) {
                mustQueries.add(Query.of(m -> m.range(r -> r.field("acreage").gte(JsonData.of(filterPostReq.getAcreage().getFrom())).lte(JsonData.of(filterPostReq.getAcreage().getTo() != null ? filterPostReq.getAcreage().getTo() : filterPostReq.getAcreage().getFrom() + 500)) // Default upper bound
                )));
            }
            List<Query> shouldQueries = new ArrayList<>();
            String keyQuery = StringUtils.isEmpty(filterPostReq.getKey()) ? "*" : filterPostReq.getKey();
            shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("content").value(keyQuery.equals("*") ? "*" : "*" + keyQuery + "*"))));
            shouldQueries.add(Query.of(m -> m.wildcard(w -> w.field("title").value(keyQuery.equals("*") ? "*" : "*" + keyQuery + "*"))));
            List<Query> filterQueries = new ArrayList<>();

            if (filterPostReq.getType() != null) {
                filterQueries.add(Query.of(f -> f.term(t -> t.field("type").value(filterPostReq.getType()))));
            }

            if (filterPostReq.getProvince() != null) {
                filterQueries.add(Query.of(f -> f.term(t -> t.field("province").value(filterPostReq.getProvince()))));
            }

            if (filterPostReq.getDistrict() != null) {
                filterQueries.add(Query.of(f -> f.term(t -> t.field("district").value(filterPostReq.getDistrict()))));
            }

            if (filterPostReq.getStatusRoom() != null) {
                filterQueries.add(Query.of(f -> f.term(t -> t.field("statusRoom").value(filterPostReq.getStatusRoom()))));
            }

            return b.must(mustQueries).should(shouldQueries).minimumShouldMatch("1").filter(filterQueries);
        });
    }

    private Map<String, SortOrder> getOrderSort(String value) {
        Map<String, SortOrder> map = new HashMap<>();
        if (value == null) {
            map.put("createdAt", SortOrder.Desc);
            return map;
        }
        switch (value) {
            case "newest":
                map.put("createdAt", SortOrder.Desc);
                map.put("updatedAt", SortOrder.Desc);
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
}
