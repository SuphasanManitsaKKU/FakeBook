package com.suphasan.demo.route;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Controller
public class routeController {

    @GetMapping("/")
    public String home(Model model) {
        RestTemplate restTemplate = new RestTemplate();

        // ดึงข้อมูลจาก /api/
        String apiUrl = "http://localhost:8080/api/";
        @SuppressWarnings("unchecked")
        Map<String, String> apiResponse = restTemplate.getForObject(apiUrl, Map.class);

        // ดึงข้อมูลจาก /api/test
        String testApiUrl = "http://localhost:8080/api/test";
        @SuppressWarnings("unchecked")
        Map<String, String> testApiResponse = restTemplate.getForObject(testApiUrl, Map.class);

        // ส่งข้อมูลไปยัง index.html
        model.addAttribute("apiMessage", apiResponse.get("message"));
        model.addAttribute("testApiMessage", testApiResponse.get("message"));

        return "index"; // Spring จะโหลด index.html จาก resources/templates
    }
}
