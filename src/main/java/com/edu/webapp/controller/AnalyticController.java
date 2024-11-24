package com.edu.webapp.controller;

import com.edu.webapp.model.response.Report1Res;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;

@RequiredArgsConstructor
@RequestMapping("/api/v1/analytic")
@RestController
public class AnalyticController {

    @GetMapping("/report-1")
    public ResponseEntity<Report1Res> report1(@RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
                                              @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report-2")
    public ResponseEntity<Report1Res> report2(@RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
                                              @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report-3")
    public ResponseEntity<Report1Res> report3(@RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
                                              @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report-4")
    public ResponseEntity<Report1Res> report4() {
        return ResponseEntity.ok().build();
    }
}
