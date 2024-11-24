package com.edu.webapp.controller;

import com.edu.webapp.model.request.ReportReq;
import com.edu.webapp.model.response.Report1Res;
import com.edu.webapp.model.response.Report2Res;
import com.edu.webapp.model.response.Report3Res;
import com.edu.webapp.model.response.Report4Res;
import com.edu.webapp.service.AnalyticService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;


@RequiredArgsConstructor
@RequestMapping("/api/v1/analytic")
@RestController
public class AnalyticController {
    private final AnalyticService analyticService;
    @PostMapping("/report-1")
    public ResponseEntity<Report1Res> report1(@RequestBody ReportReq reportReq) {
        return ResponseEntity.ok(analyticService.report1(reportReq));
    }

    @PostMapping("/report-2")
    public ResponseEntity<Report2Res> report2(@RequestBody ReportReq reportReq) {
        return ResponseEntity.ok(analyticService.report2(reportReq));
    }

    @PostMapping("/report-3")
    public ResponseEntity<Report3Res> report3(@RequestBody ReportReq reportReq) {
        return ResponseEntity.ok(analyticService.report3(reportReq));
    }

    @PostMapping("/report-4")
    public ResponseEntity<Report4Res> report4() {
        return ResponseEntity.ok(analyticService.report4());
    }
}
