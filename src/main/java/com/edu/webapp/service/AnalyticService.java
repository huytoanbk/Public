package com.edu.webapp.service;

import com.edu.webapp.model.request.ReportReq;
import com.edu.webapp.model.response.Report1Res;
import com.edu.webapp.model.response.Report2Res;
import com.edu.webapp.model.response.Report3Res;
import com.edu.webapp.model.response.Report4Res;

public interface AnalyticService {
    Report1Res report1(ReportReq reportReq);

    Report2Res report2(ReportReq reportReq);

    Report3Res report3(ReportReq reportReq);

    Report4Res report4();
}
