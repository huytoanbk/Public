package com.edu.webapp.controller;

import com.edu.webapp.service.impl.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1")
public class VNPayCallbackController {

    @Autowired
    private VNPayService vnPayService;

    @GetMapping("/vnpay-payment")
    public RedirectView handlePaymentCallback(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);
        if (paymentStatus == 1) {
            return new RedirectView("http://localhost:3000/payment-success");
        } else {
            return new RedirectView("http://localhost:3000/payment-fail");
        }
    }
}

