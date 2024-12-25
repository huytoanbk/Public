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
public class Report3Res {
    List<Integer> postActive;
    List<Integer> postPending;
    List<Integer> postReject;
    List<Integer> postInactive;
}
