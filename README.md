# Fitmate

แอปมือถือด้านสุขภาพและการออกกำลังกาย สร้างด้วย **React Native + Expo** ใช้ **json-server** เป็น mock backend
รวมคลังท่าออกกำลังกาย คำแนะนำอาหาร ตารางกิจกรรมรายวัน เครื่องคำนวณ BMI และโปรไฟล์ผู้ใช้ รองรับ Android, iOS และ Web

## สารบัญ

- [ฟีเจอร์](#ฟีเจอร์)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [เริ่มต้นอย่างรวดเร็ว](#เริ่มต้นอย่างรวดเร็ว)
- [การติดตั้งและใช้งาน](#การติดตั้งและใช้งาน)
- [โครงสร้างการนำทาง](#โครงสร้างการนำทาง)
- [Mock API (db.json)](#mock-api-dbjson)
- [Endpoint ที่แอปเรียกใช้](#endpoint-ที่แอปเรียกใช้)
- [รายละเอียดแต่ละหน้าจอ](#รายละเอียดแต่ละหน้าจอ)
- [ข้อจำกัดที่ทราบ](#ข้อจำกัดที่ทราบ)
- [แก้ปัญหาเบื้องต้น](#แก้ปัญหาเบื้องต้น)

## ฟีเจอร์

- **สมัครสมาชิก / เข้าสู่ระบบ** — เก็บ `currentUserId` ไว้ใน AsyncStorage
- **Home** — แท็บ แนะนำ / เนื้อหา / ข้อมูล / กิจกรรม พร้อมตารางกิจกรรม 3 วันที่เพิ่ม/ลบได้
- **Trainer** — คลังท่าออกกำลังกาย 10 ท่า พร้อมหน้ารายละเอียด (อุปกรณ์ เป้าหมาย กล้ามเนื้อที่ได้ ระดับ)
- **Eating** — สไลด์โปรโมชันอัตโนมัติ รายการอาหาร 40 รายการกรองตามหมวด และรายการโปรด
- **BMI** — คำนวณ BMI ตามเกณฑ์เอเชีย แสดงแถบสีพร้อมตัวชี้ และให้คำแนะนำ
- **Profile** — แก้ไขข้อมูลส่วนตัว เปลี่ยนรูปโปรไฟล์ (URL) ให้คะแนน ส่งรายงานปัญหา และออกจากระบบ
- **ธีมสว่าง/มืด** — สลับได้จากปุ่มบนหน้า Home

## เทคโนโลยีที่ใช้

| ส่วน | ไลบรารี |
| --- | --- |
| Framework | Expo (`^58`), React Native `0.88`, React `19.3`, react-native-web |
| Navigation | React Navigation (native-stack, bottom-tabs) |
| HTTP | axios |
| เก็บข้อมูลในเครื่อง | @react-native-async-storage/async-storage |
| UI / กราฟิก | expo-linear-gradient, react-native-svg, react-native-safe-area-context |
| อื่น ๆ | @react-native-community/datetimepicker, dayjs |
| Mock API | json-server |

> `react-native-chart-kit`, `react-native-image-picker` และ `react-native-linear-gradient` อยู่ใน `package.json` แต่ยังไม่ถูกใช้ในโค้ดตอนนี้

## โครงสร้างโปรเจค

```
Fitmate/
├── App.js                  # กำหนด Navigation: Login/Register → MainTabs
├── index.js                # Entry point
├── app.json                # Expo config
├── db.json                 # ข้อมูลจำลองสำหรับ json-server
├── assets/                 # ไอคอน / splash
└── src/
    ├── ThemeContext.js     # ธีมสว่าง/มืด (colors, mode, toggle)
    ├── api/client.js       # axios instance (baseURL, timeout 10 วินาที)
    ├── components/Screen.js# wrapper ของทุกหน้า (scroll, safe area)
    ├── data/exercises.js   # ข้อมูลท่าออกกำลังกาย (ใช้ร่วมกันทั้งรายการและรายละเอียด)
    ├── img/                # โลโก้ และรูปท่าออกกำลังกาย tha1–tha10
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── HomeScreen.js
    │   ├── TrainerListScreen.js
    │   ├── TrainerDetailScreen.js
    │   ├── EatingScreen.js
    │   ├── BmiScreen.js
    │   └── ProfileScreen.js
    └── utils/auth.js       # set/get/clear userId ใน AsyncStorage
```

## เริ่มต้นอย่างรวดเร็ว

รันบนเว็บในเครื่องเดียว (เปิด 2 เทอร์มินัล):

```bash
# เทอร์มินัล 1 — mock API
npx json-server --watch db.json --host 0.0.0.0 --port 3000

# เทอร์มินัล 2 — แอป (ชี้ API ไปที่ localhost)
npm install
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run web
```

จากนั้นเปิด `http://localhost:8081` แล้วล็อกอินด้วยบัญชีที่มีอยู่ใน `db.json`
(ใน PowerShell ใช้ `$env:EXPO_PUBLIC_API_URL="http://localhost:3000"; npm run web`)

## การติดตั้งและใช้งาน

### สิ่งที่ต้องมี

- Node.js และ npm
- แอป **Expo Go** บนมือถือ (หรือ Android emulator / iOS simulator)

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า API

แอปอ่าน URL ของ API จากตัวแปรสภาพแวดล้อม `EXPO_PUBLIC_API_URL`
ถ้าไม่ตั้งค่า จะใช้ค่าเริ่มต้น `http://172.20.10.2:3000` (กำหนดใน `src/api/client.js`)

```js
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://172.20.10.2:3000",
  timeout: 10000,
});
```

วิธีตั้งค่า เลือกอย่างใดอย่างหนึ่ง:

- สร้างไฟล์ `.env` ที่รากโปรเจค: `EXPO_PUBLIC_API_URL=http://192.168.1.50:3000`
- หรือกำหนดตอนรันคำสั่ง (ดูตัวอย่างด้านบน)
- หรือแก้ค่าเริ่มต้นใน `src/api/client.js` โดยตรง

| รันแอปบน | ค่า host ที่ใช้ |
| --- | --- |
| มือถือจริง (Expo Go) | IP ของเครื่องใน LAN เช่น `192.168.x.x` (ต้องอยู่ Wi‑Fi เดียวกับคอม) |
| Web ในเครื่องเดียวกัน | `localhost` |
| Android emulator | `10.0.2.2` |
| iOS simulator | `localhost` |

หา IP ของเครื่อง: `ipconfig` (Windows) หรือ `ifconfig` / `ip a` (macOS / Linux)

### 3. เริ่ม mock server

```bash
npx json-server --watch db.json --host 0.0.0.0 --port 3000
```

> json-server จะ**เขียนทับ `db.json`** ทุกครั้งที่แอปสมัครสมาชิก บันทึกโปรไฟล์ หรือเพิ่มรายการโปรด
> ถ้าต้องการกลับไปข้อมูลเริ่มต้น ให้เก็บสำเนา `db.json` ไว้ก่อนทดสอบ แล้วคัดลอกกลับมาทับเมื่อต้องการ (โปรเจคนี้ยังไม่ได้ใช้ git)

### 4. เริ่มแอป

```bash
npm start          # เปิด Expo แล้วสแกน QR ด้วย Expo Go
npm run android
npm run ios
npm run web
```

เปลี่ยน `EXPO_PUBLIC_API_URL` แล้วต้องรีสตาร์ต Metro ด้วย `npx expo start -c` เพื่อให้ค่าใหม่มีผล

## โครงสร้างการนำทาง

```
RootStack
├── Login
├── Register
└── MainTabs (Bottom Tabs)
    ├── Home
    ├── Trainer (Stack)
    │   ├── TrainerList
    │   └── TrainerDetail   (รับ param: id)
    ├── Eating
    ├── BMI
    └── Profile
```

หลังล็อกอินหรือสมัครสำเร็จ แอปใช้ `navigation.replace("MainTabs")` และตอนออกจากระบบใช้ `replace("Login")`
จึงกดย้อนกลับไปหน้าล็อกอินไม่ได้

## Mock API (db.json)

| Resource | จำนวน | ฟิลด์หลัก |
| --- | --- | --- |
| `/users` | 7 | `id, avatar, firstName, lastName, email, password, phone, bio, dob, heightCm, weightKg, rating, favIds[], reports[]` และหลังคำนวณ BMI จะมี `age, sex, height, weight, bmi, category` เพิ่ม |
| `/foods` | 40 | `id, name, kcal, cat, uri` |
| `/contents` | 25 | `id, title, desc, link` (ลิงก์ YouTube) |
| `/recommends` | 4 | `id, text` |
| `/infos` | 4 | `id, text` |
| `/activities` | 7 | `id, time, text, day` (`day` = `today` / `tomorrow` / `day3`) |

หมวดอาหารที่ใช้กรอง: `เนื้อ`, `น้ำ`, `ข้าว`, `อาหารว่าง`

## Endpoint ที่แอปเรียกใช้

| Method | Path | ใช้ที่ | หน้าที่ |
| --- | --- | --- | --- |
| GET | `/users` | Login | ดึงผู้ใช้ทั้งหมดแล้วเทียบอีเมล/รหัสผ่านฝั่ง client |
| POST | `/users` | Register, Profile | สร้างผู้ใช้ใหม่ |
| GET | `/users/:id` | Home, Eating, BMI, Profile | โหลดข้อมูลผู้ใช้ปัจจุบัน |
| PATCH | `/users/:id` | Eating, BMI, Profile | อัปเดต `favIds`, ผล BMI, `avatar`, `reports` และบันทึกโปรไฟล์ |
| GET | `/foods` | Eating | รายการอาหาร |
| GET | `/recommends` `/contents` `/infos` `/activities` | Home | ข้อมูลแต่ละแท็บ |
| POST | `/activities` | Home | เพิ่มกิจกรรม |
| DELETE | `/activities/:id` | Home | ลบกิจกรรม |

## รายละเอียดแต่ละหน้าจอ

### Login / Register
- ล็อกอินโดยดึง `/users` มาค้นหาผู้ใช้ที่อีเมลและรหัสผ่านตรงกัน แล้วเก็บ `id` ลง AsyncStorage
- สมัครสมาชิกต้องกรอกครบทุกช่องและรหัสผ่านตรงกับช่องยืนยัน ระบบสร้าง `id` จาก `Date.now()` และใส่ค่าเริ่มต้น (รูปโปรไฟล์ วันเกิด `2000-01-01` ส่วนสูง/น้ำหนัก 0)
- ธีมหน้าล็อกอินเป็นไล่สีเขียว–ขาว (`expo-linear-gradient`)

### Home
- ส่วนหัวแสดงรูปและชื่อผู้ใช้ (กดรูปเพื่อไปหน้า Profile) และปุ่มสลับธีม 🌙 / ☀️
- **แนะนำ** — คลิปแนะนำประจำวัน คำแนะนำจาก `/recommends` วิดีโอเด่นเลื่อนแนวนอน และแกลเลอรี
- **เนื้อหา** — รายการจาก `/contents` พร้อมปุ่มเปิดคลิป YouTube
- **ข้อมูล** — ข้อมูลโภชนาการ/การพักผ่อนจาก `/infos`
- **กิจกรรม** — ตารางวันนี้ / พรุ่งนี้ / วันที่ 3 กรอกเวลา (รับเฉพาะตัวเลขและ `:`) กับรายละเอียด แล้วกด "เพิ่ม" หรือ "ลบ"
  ถ้าเรียก API ไม่สำเร็จ รายการจะถูกเพิ่ม/ลบเฉพาะในหน้าจอ และไม่ถูกบันทึกลง `db.json`

### Trainer
- รายการท่าออกกำลังกาย 10 ท่า พร้อมแท็ก เช่น Strength, Core, Free Weight
- หน้ารายละเอียดแสดงรูป ประเภท อุปกรณ์ที่ใช้ เป้าหมายหลัก กล้ามเนื้อที่ได้ และระดับ (ง่าย/ปานกลาง/ยาก)
- ข้อมูลท่าเป็นค่าคงที่ใน `src/data/exercises.js` ไม่ได้มาจาก `db.json` (`id` ต้องตรงกับรูป `tha{id}.png`)

### Eating
- สไลด์โปรโมชัน 5 ภาพ เลื่อนอัตโนมัติทุก 3.5 วินาที พร้อมจุดบอกตำแหน่ง
- แท็บ **แนะนำ** (อาหารทั้งหมด) และ **Favorites** (เฉพาะที่กด ❤️)
- กรองตามหมวด ทั้งหมด / เนื้อ / น้ำ / ข้าว / อาหารว่าง
- กด ❤️ เพื่อเพิ่ม/ลบรายการโปรด ระบบบันทึกลง `favIds` ของผู้ใช้ทันที

### BMI
- กรอกเพศ อายุ ส่วนสูง (ซม.) และน้ำหนัก (กก.) ปุ่มคำนวณจะกดได้เมื่อค่าทั้งสามมากกว่า 0
- สูตร `BMI = น้ำหนัก / (ส่วนสูงเป็นเมตร)²` ปัดเป็นทศนิยม 2 ตำแหน่ง
- เกณฑ์เอเชีย

  | BMI | ผล |
  | --- | --- |
  | < 18.5 | น้ำหนักน้อย |
  | 18.5 – 22.9 | ปกติ |
  | 23 – 24.9 | น้ำหนักเกิน |
  | ≥ 25 | อ้วน |

- แสดงแถบสีพร้อมตัวชี้เคลื่อนไหว และกล่องคำแนะนำตามผลลัพธ์
- ผลลัพธ์และข้อมูลที่กรอกจะถูกบันทึกลงโปรไฟล์ผู้ใช้ และโหลดกลับมาเมื่อเปิดหน้าอีกครั้ง ส่วนสูง/น้ำหนักใช้ฟิลด์ `heightCm`/`weightKg` ร่วมกับหน้า Profile และถ้ายังไม่มีอายุจะคำนวณจากวันเกิด

### Profile
- แก้ไขชื่อ นามสกุล อีเมล รหัสผ่าน เบอร์โทร และข้อความแนะนำตัว
- เลือกวันเกิดด้วย date picker ระบบคำนวณ **อายุ** และ **BMI** ให้อัตโนมัติ
- กดรูปโปรไฟล์เพื่อเปิดหน้าต่างพรีวิวและเปลี่ยนรูปโดยวาง URL
- ให้คะแนน 1–5 ดาว
- ส่งรายงานปัญหา ข้อความจะถูกต่อท้ายใน `reports` ของผู้ใช้พร้อมเวลา
- ออกจากระบบ ล้าง `currentUserId` แล้วกลับหน้าล็อกอิน

## ข้อจำกัดที่ทราบ

- **ความปลอดภัย:** รหัสผ่านเก็บเป็นข้อความธรรมดาใน `db.json` และตรวจฝั่ง client ใช้เพื่อเดโมเท่านั้น
- **ช่องค้นหา** บนหน้า Home และ Trainer ยังเป็นเพียง UI ยังไม่ได้ทำงานจริง
- **รูปจากเว็บภายนอก:** รูปโปรไฟล์ (ลิงก์ Facebook CDN) และรูปอาหารบางรายการ (`img.wongnai.com`, wikimedia) อาจโหลดไม่ขึ้นหรือหมดอายุ ตอนทดสอบบนเว็บเห็นเป็นวงกลม/กล่องว่าง ยังไม่มีรูปสำรอง (fallback)
- การเปลี่ยนรูปโปรไฟล์ทำได้ด้วย URL เท่านั้น (`react-native-image-picker` ยังไม่ได้ต่อใช้งาน)
- ป้าย "รีวิว" ในหน้า Profile คือฟิลด์ `bio` ของผู้ใช้
- กิจกรรมในหน้า Home ถ้าเรียก API ไม่สำเร็จจะเพิ่ม/ลบเฉพาะในหน้าจอ ไม่ถูกบันทึกลง `db.json`
- ต้องรัน json-server ก่อนเสมอ มิฉะนั้นล็อกอินและโหลดข้อมูลไม่ได้

## แก้ปัญหาเบื้องต้น

| อาการ | วิธีแก้ |
| --- | --- |
| "เชื่อมต่อ API ไม่สำเร็จ" | ตรวจว่ารัน json-server แล้ว และ `baseURL` เป็น IP ถูกต้อง |
| มือถือเชื่อมต่อไม่ได้ | ให้มือถือกับคอมอยู่ Wi‑Fi เดียวกัน และเปิดพอร์ต 3000 ใน firewall |
| รัน json-server ไม่ได้ | ใช้ `--host 0.0.0.0` เพื่อให้เครื่องอื่นใน LAN เข้าถึงได้ |
| รูปไม่ขึ้น | รูปส่วนใหญ่ดึงจากอินเทอร์เน็ต ตรวจว่ามีสัญญาณ และลิงก์รูปยังใช้งานได้ (บางลิงก์หมดอายุ) |
| เปลี่ยน `EXPO_PUBLIC_API_URL` / `baseURL` แล้วไม่มีผล | รีสตาร์ต Metro ด้วย `npx expo start -c` |
| ล็อกอินไม่ผ่านทั้งที่ API ทำงาน | ตรวจอีเมล/รหัสผ่านให้ตรงกับใน `db.json` (ตัวพิมพ์เล็ก-ใหญ่มีผล) |
| พอร์ต 3000 หรือ 8081 ถูกใช้อยู่ | ปิดโปรเซสเดิม หรือเปลี่ยนพอร์ตด้วย `--port` แล้วแก้ URL ให้ตรงกัน |
