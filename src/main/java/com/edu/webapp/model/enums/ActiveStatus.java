package com.edu.webapp.model.enums;

public enum ActiveStatus {
    ACTIVE, INACTIVE;

    public static ActiveStatus getActiveStatus(String value) {
        for (ActiveStatus status : ActiveStatus.values()) {
            if (status.name().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException();
    }


    public boolean isActiveStatus() {
        return this == ActiveStatus.ACTIVE;
    }
}
