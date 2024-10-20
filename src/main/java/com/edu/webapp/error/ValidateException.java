package com.edu.webapp.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class ValidateException extends RuntimeException {
    private ErrorCodes error;
}
