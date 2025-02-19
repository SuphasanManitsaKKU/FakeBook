package com.kku.testapi.middleware;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.kku.testapi.Util.JwtUtil;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(@SuppressWarnings("null") HttpServletRequest request, @SuppressWarnings("null") HttpServletResponse response, @SuppressWarnings("null") Object handler)
            throws Exception {
        String requestURI = request.getRequestURI();

        // อนุญาตเฉพาะ URL ที่ระบุ โดยไม่ต้องตรวจสอบ JWT
        if (requestURI.equals("/api/users/login") ||
                requestURI.equals("/api/users/register") ||
                requestURI.equals("/api/users/logout") ||
                requestURI.equals("/api/users")) {
            return true;
        }

        // ตรวจสอบ JWT สำหรับเส้นทางอื่นๆ
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Missing token");
            return false;
        }

        try {
            String username = JwtUtil.getUsernameFromToken(token);
            request.setAttribute("username", username);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid token");
            return false;
        }

        return true;
    }
}
