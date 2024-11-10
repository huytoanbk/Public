package com.edu.webapp.mapper;

import com.edu.webapp.entity.post.Image;
import com.edu.webapp.entity.post.Post;
import com.edu.webapp.model.enums.RoomStatus;
import com.edu.webapp.model.enums.TypeRoom;
import com.edu.webapp.model.request.PostCreateReq;
import com.edu.webapp.model.response.PostRes;
import com.edu.webapp.model.response.PostUserRes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "images", ignore = true)
    Post postReqToPost(PostCreateReq postCreateReq);

    List<PostRes> postsToPosts(List<Post> posts);

    @Mapping(source = "images", target = "images", qualifiedByName = "convertImages")
    @Mapping(source = "statusRoom", target = "statusRoom", qualifiedByName = "convertStatusRoom")
    @Mapping(source = "type", target = "type", qualifiedByName = "convertType")
    PostRes postToPostRes(Post post);

    List<PostUserRes> postsToPostsUsers(List<Post> posts);

    PostUserRes postToPostUserRes(Post post);
    @Named("convertType")
    default String convertType(TypeRoom typeRoom) {
        switch (typeRoom) {
            case RENT -> {
                return "Cho thuê";
            }
            case GRAFT -> {
                return "Ở ghép";
            }
            default -> {
                return null;
            }
        }
    }

    @Named("convertImages")
    default List<String> convertImages(List<Image> images) {
        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> res = new ArrayList<>();
        for (Image image : images) {
            res.add(image.getImage());
        }
        return res;
    }

    @Named("convertStatusRoom")
    default String convertStatusRoom(RoomStatus statusRoom) {
        switch (statusRoom) {
            case EMPTY -> {
                return "Nhà trống";
            }
            case FULLY_FURNISHED -> {
                return "Nội thất đầy đủ";
            }
            case LUXURY_FURNITURE -> {
                return "Nội thất cao cấp";
            }
            default -> {
                return null;
            }
        }
    }
}
