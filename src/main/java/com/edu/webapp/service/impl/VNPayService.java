package com.edu.webapp.service.impl;

import com.edu.webapp.config.VNPayConfig;
import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import com.edu.webapp.entity.advertisement.PayAd;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.error.ErrorCodes;
import com.edu.webapp.error.ValidateException;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.repository.AdvertisingPackageRepository;
import com.edu.webapp.repository.PayAdRepository;
import com.edu.webapp.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    private final PayAdRepository payAdRepository;
    private final AdvertisingPackageRepository advertisingPackageRepository;
    private final UserRepository userRepository;
    public String createOrder(String orderId,int total, String orderInfor, String urlReturn){
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_IpAddr = "0.0.0.0";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(total*100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", orderInfor);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

        urlReturn += VNPayConfig.vnp_Returnurl;
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }

    public int orderReturn(HttpServletRequest request){
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPayConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                PayAd payAd = payAdRepository.findById(Integer.valueOf((String)fields.get("vnp_TxnRef"))).orElse(new PayAd());
                if (payAd.getType() == 0) {
                    payAd.setActive(ActiveStatus.ACTIVE);
                    payAdRepository.save(payAd);
                    log.info("Pay Ad successful and data = {}", payAd);
                    User user = userRepository.findById(payAd.getUserId()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
                    AdvertisingPackage advertisingPackage = advertisingPackageRepository.findById(payAd.getAdvertisingPackage())
                            .orElseThrow(() -> new ValidateException(ErrorCodes.ADVERTISING_PACKAGE_VALID));
                    LocalDate rechargeVip = user.getRechargeVip();
                    if (rechargeVip != null) {
                        rechargeVip.plusDays(advertisingPackage.getCountDate());
                    } else rechargeVip = LocalDate.now().plusDays(advertisingPackage.getCountDate());
                    user.setRechargeVip(rechargeVip);
                    userRepository.save(user);
                }
                if (payAd.getType()==1){
                    payAd.setActive(ActiveStatus.ACTIVE);
                    payAdRepository.save(payAd);
                    log.info("Pay Ad successful and data = {}", payAd);
                    User user = userRepository.findById(payAd.getUserId()).orElseThrow(() -> new ValidateException(ErrorCodes.USER_NOT_EXIST));
                    AdvertisingPackage advertisingPackage = advertisingPackageRepository.findById(payAd.getAdvertisingPackage())
                            .orElseThrow(() -> new ValidateException(ErrorCodes.ADVERTISING_PACKAGE_VALID));
                    user.setPostVip(user.getPostVip() + advertisingPackage.getCountDate());
                    userRepository.save(user);
                }
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

}
