package com.edu.webapp.utils;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.Period;

public class TimeUtils {

    public static String formatTimeDifference(OffsetDateTime startTime, OffsetDateTime endTime) {
        Duration duration = Duration.between(startTime, endTime);
        long hours = duration.toHours();

        if (hours < 24) {
            return hours + " giờ trước";
        }

        long days = duration.toDays();
        if (days < 7) {
            return days + " ngày trước";
        }

        if (days < 30) {
            long weeks = days / 7;
            return weeks + " tuần trước";
        }

        Period period = Period.between(startTime.toLocalDate(), endTime.toLocalDate());
        if (period.getYears() < 1) {
            return period.getMonths() + " tháng trước";
        }

        return period.getYears() + " năm trước";
    }
}
