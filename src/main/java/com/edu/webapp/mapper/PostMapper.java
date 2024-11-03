package com.edu.webapp.mapper;

import com.edu.webapp.entity.post.Image;
import com.edu.webapp.entity.post.Post;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.model.request.PostCreateReq;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "images", ignore = true)
    Post postReqToPost(PostCreateReq postCreateReq);

    List<PostRes> postsToPosts(List<Post> posts);

    @Mapping(source = "images", target = "images", qualifiedByName = "convertImages")
    PostRes postToPostRes(Post post);

    List<PostUserRes> postsToPostsUsers(List<Post> posts);

    PostUserRes postToPostUserRes(Post post);

    @Named("convertImages")
    default List<String> convertImages(List<Image> images) {
        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> res = new ArrayList<>();
        for (Image image : images) {
//            res.add(Base64.getEncoder().encodeToString(image.getImage()));
            res.add("https://www.anhngumshoa.com/uploads/images/userfiles/banner_web3.jpg");
        }
        return res;
    }
}
