package com.edu.webapp.service.impl;

import com.edu.webapp.entity.post.ReportPost;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.request.ReportReq;
import com.edu.webapp.model.response.Report1Res;
import com.edu.webapp.model.response.Report2Res;
import com.edu.webapp.model.response.Report3Res;
import com.edu.webapp.model.response.Report4Res;
import com.edu.webapp.repository.*;
import com.edu.webapp.service.AnalyticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AnalyticServiceImpl implements AnalyticService {

    private final UserRepository userRepository;

    private final PayAdRepository payAdRepository;

    private final ReportPostRepository reportPostRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikePostRepository likePostRepository;

    @Override
    public Report1Res report1(ReportReq reportReq) {
        Report1Res report1Res = new Report1Res();
        report1Res.setRegistrationCount(userRepository.registrationCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report1Res.setLoginCount(userRepository.loginCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report1Res.setExpiredUserCount(userRepository.expiredUserCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report1Res.setPackagePurchaseCount(payAdRepository.packagePurchaseCount(reportReq.getStartDate(), reportReq.getEndDate()));
        return report1Res;
    }

    @Override
    public Report2Res report2(ReportReq reportReq) {
        Report2Res report2Res = new Report2Res();
        report2Res.setRegisters(userRepository.registrationCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report2Res.setMembers(payAdRepository.packagePurchaseCount(reportReq.getStartDate(), reportReq.getEndDate()));
        return report2Res;
    }

    @Override
    public Report3Res report3(ReportReq reportReq) {
        ReportPost reportPost = new ReportPost();
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);
        reportPostRepository.deleteByCreatedAt(sqlDate);
        reportPost.setPostActive(postRepository.countByActive(ActiveStatus.ACTIVE));
        reportPost.setPostInactive(postRepository.countByActive(ActiveStatus.INACTIVE));
        reportPost.setPostPending(postRepository.countByActive(ActiveStatus.PENDING));
        reportPost.setPostReject(postRepository.countByActive(ActiveStatus.REJECT));
        reportPostRepository.save(reportPost);
        Report3Res report3Res = new Report3Res();
        report3Res.setPostActive(reportPostRepository.postActiveCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report3Res.setPostInactive(reportPostRepository.postInactiveCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report3Res.setPostPending(reportPostRepository.postPendingCount(reportReq.getStartDate(), reportReq.getEndDate()));
        report3Res.setPostReject(reportPostRepository.postRejectCount(reportReq.getStartDate(), reportReq.getEndDate()));
        return report3Res;
    }

    @Override
    public Report4Res report4() {
        Report4Res report4Res = new Report4Res();
        report4Res.setTime(commentRepository.get12Month());
        report4Res.setComment(commentRepository.countLikeByMonth());
        report4Res.setLike(likePostRepository.countLikeByMonth());
        return report4Res;
    }
}
