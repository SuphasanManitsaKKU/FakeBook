import { Component, OnInit } from '@angular/core'; // นำเข้า OnInit
import { FormsModule } from '@angular/forms'; // นำเข้า FormsModule
import { CommonModule } from '@angular/common'; // นำเข้า CommonModule สำหรับ *ngFor
import axios from 'axios'; // นำเข้า Axios
import { User } from './type'; // ตรวจสอบว่าไฟล์ type.ts มีการกำหนด Interface ที่ถูกต้อง

@Component({
    selector: 'app-root',
    imports: [FormsModule, CommonModule], // เพิ่ม CommonModule
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit { // เพิ่ม implements OnInit
    data: User[] = []; // ตัวแปรสำหรับเก็บข้อมูลจาก API

    // ฟังก์ชันสำหรับเรียก API
    async fetchData() {
        const apiUrl = 'https://jsonplaceholder.typicode.com/users'; // URL ของ API
        try {
            const response = await axios.get<User[]>(apiUrl); // ใช้ Axios GET พร้อม Type Safety
            console.log(response.data); // ดูข้อมูลใน Console
            this.data = response.data; // เก็บข้อมูลในตัวแปร
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error); // จัดการ Error
        }
    }

    // Lifecycle Hook ที่ทำงานเมื่อ Component ถูกสร้างขึ้น
    ngOnInit(): void {
        this.fetchData(); // เรียก API ตั้งแต่เริ่มต้น
    }

    title = 'frontend';
    resoult = 0;

    // ฟังก์ชันคำนวณค่า
    ok(value: string) {
        this.resoult = (Number(value) * 3) / 4;
        console.log('ok', this.resoult);
    }
}
