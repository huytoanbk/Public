package com.edu.webapp.config;

import com.edu.webapp.entity.post.ReportPost;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.repository.PostRepository;
import com.edu.webapp.repository.ReportPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class CronJob {
    private final PostRepository postRepository;
    private final ReportPostRepository reportPostRepository;

    @Scheduled(cron = "0 0 1 * * ?")  // Chạy vào 1:00 sáng mỗi ngày
    public void runCronTask() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        Date sqlDate = Date.valueOf(yesterday);
        reportPostRepository.deleteByCreatedAt(sqlDate);
        ReportPost reportPost = new ReportPost();
        reportPost.setPostActive(postRepository.countByActive(ActiveStatus.ACTIVE));
        reportPost.setPostInactive(postRepository.countByActive(ActiveStatus.INACTIVE));
        reportPost.setPostPending(postRepository.countByActive(ActiveStatus.PENDING));
        reportPost.setPostReject(postRepository.countByActive(ActiveStatus.REJECT));
        reportPostRepository.save(reportPost);
    }
}
