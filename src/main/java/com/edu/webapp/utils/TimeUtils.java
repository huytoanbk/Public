package com.edu.webapp.utils;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.Period;

public class TimeUtils {

    public static String formatTimeDifference(OffsetDateTime startTime, OffsetDateTime endTime) {
        if (startTime == null) {
            startTime = OffsetDateTime.now();

        }
        if (endTime == null) {
            endTime = OffsetDateTime.now();
        }
        Duration duration = Duration.between(startTime, endTime);
        long minute = duration.toMinutes();
        if (minute < 60) {
            if (minute == 0) return " vài giây trước";
            return minute + " phút trước";
        }
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
