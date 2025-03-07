package com.kku.testapi;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestapiApplication {

    static {
        // โหลด .env ที่อยู่ข้างนอก backend/
        Dotenv dotenv = Dotenv.configure()
                .directory("../") // ระบุ path ไปยัง .env
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        // ตั้งค่าค่า environment variables
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }

    public static void main(String[] args) {
        SpringApplication.run(RestapiApplication.class, args);
    }
}