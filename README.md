# Fakebook (Angular + Spring Boot)

## 📚 Tech Stack
- **Frontend**: [Angular 19](https://angular.io/)
- **Backend**: [Java Spring Boot](https://spring.io/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Real-time Communication**: WebSocket for chat and notifications

---

## ✨ Description
Fakebook เป็นแพลตฟอร์มเครือข่ายสังคมออนไลน์ที่ช่วยให้ผู้ใช้สามารถ:
- **โพสต์และแชร์** เนื้อหาบนฟีดข่าว
- **กดไลก์และแสดงความคิดเห็น** บนโพสต์
- **แชทแบบเรียลไทม์** ผ่านระบบข้อความส่วนตัว
- **จัดการเพื่อน** ด้วยการส่งคำขอเป็นเพื่อน ยอมรับ หรือปฏิเสธ
- **อัปโหลดรูปโปรไฟล์และภาพปก**
- **รับการแจ้งเตือน** เมื่อมีการโต้ตอบต่างๆ บนแพลตฟอร์ม

---

## 🎯 Outcome
Fakebook ช่วยให้ผู้ใช้สามารถ:
- สร้างและบริหารเครือข่ายเพื่อนของตน
- โต้ตอบกับเพื่อนผ่านโพสต์ คอมเมนต์ และการกดไลก์
- รับการแจ้งเตือนแบบเรียลไทม์
- แชทกับเพื่อนแบบส่วนตัว
- จัดการโปรไฟล์ส่วนตัวได้ง่าย

---

## 🚀 Setup Instructions

### Prerequisites
ก่อนติดตั้ง ตรวจสอบว่าคุณมี:
- [Node.js](https://nodejs.org/en) (แนะนำเวอร์ชันล่าสุด)
- [Angular CLI](https://angular.io/cli)
- [Java 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/) (ถ้าใช้ container)

### How To Run 

   ```bash
   git clone https://github.com/SuphasanManitsaKKU/FakeBook.git
   cd Fakebook
   docker compose up -d --build
