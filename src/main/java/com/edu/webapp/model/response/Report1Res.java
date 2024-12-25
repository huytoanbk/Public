package com.edu.webapp.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Report1Res {
    List<Integer> registrationCount;
    List<Integer> loginCount;
    List<Integer> packagePurchaseCount;
    List<Integer> expiredUserCount;
}
