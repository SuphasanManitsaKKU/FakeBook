# ✅ ใช้ OpenJDK 23 (รองรับ Java 23 ตาม pom.xml)
FROM openjdk:23-jdk-slim

# ✅ ตั้งค่า Directory ใน Container
WORKDIR /app

# ✅ คัดลอกไฟล์ pom.xml และดาวน์โหลด dependencies (เพื่อใช้ layer cache)
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# ✅ คัดลอกไฟล์ทั้งหมด และ Build เป็น JAR
COPY src ./src
RUN ./mvnw package -DskipTests

# ✅ ตั้งค่าตัวแปร Environment (อ่านจากไฟล์ .env ได้)
ENV SPRING_PROFILES_ACTIVE=prod

# ✅ Run Application
CMD ["java", "-jar", "target/testapi-0.0.1-SNAPSHOT.jar"]