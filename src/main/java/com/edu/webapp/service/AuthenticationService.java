package com.edu.webapp.service;

import com.edu.webapp.model.request.AuthReq;
import com.edu.webapp.model.response.AuthRes;

public interface AuthenticationService {
    AuthRes authentication(AuthReq authReq);

    AuthRes refreshToken();
}
