# Surasith.online

เว็บไซต์สไตล์มินิมอล/แมกกาซีน หรูหรา ใช้ **React + Vite + Tailwind CSS + Supabase** พร้อม Framer Motion animation

---

## ✨ Features

- 🎨 **Design**: Minimal • Clean • Glassmorphism • โทนขาว/แดง (#DC2626)
- 🏠 **หน้าบ้าน**: Header glass, Social bar, Content grid พร้อม External link
- 🔐 **หลังบ้าน**: Supabase Auth login + จัดการโพสต์/โซเชียล
- 🖼️ **อัปโหลดรูป**: ผ่าน Supabase Storage bucket `post-images`
- ✨ **Animation**: Framer Motion ทุกการเปลี่ยนหน้า/การ์ด/เมนู

---

## 📁 โครงสร้างโปรเจกต์

```
surasith-online/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── PostsManager.jsx     ← จัดการโพสต์ (CRUD + อัปโหลดรูป)
│   │   │   └── SocialManager.jsx    ← จัดการลิงก์โซเชียล
│   │   ├── Header.jsx               ← Header + Hamburger menu (glass)
│   │   ├── SocialSection.jsx        ← แถวไอคอนโซเชียล
│   │   ├── PostCard.jsx             ← การ์ดโพสต์
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── HomePage.jsx             ← หน้าแรก (public)
│   │   ├── LoginPage.jsx            ← ล็อกอินหลังบ้าน
│   │   └── AdminPage.jsx            ← Dashboard หลังบ้าน
│   ├── lib/
│   │   ├── supabaseClient.js        ← Supabase client
│   │   └── api.js                   ← API layer (posts/links/auth/storage)
│   ├── App.jsx                      ← Routing + Auth guard
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── schema.sql                   ← Schema + RLS + Storage policies
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 วิธีติดตั้ง & รัน (Local)

### 1) ติดตั้ง dependencies
```bash
npm install
```

### 2) สร้างโปรเจกต์ Supabase
1. ไปที่ https://supabase.com → **New Project**
2. รอจน database พร้อม
3. เปิด **SQL Editor** → คัดลอกเนื้อหาไฟล์ `supabase/schema.sql` → กด **Run**
4. ไปที่ **Storage** ตรวจสอบว่ามี bucket ชื่อ `post-images` แล้ว (ถ้าไม่มี ให้สร้าง public bucket ชื่อนี้)
5. ไปที่ **Authentication > Users > Add user** เพิ่มอีเมล + รหัสผ่านของ admin

### 3) ตั้งค่า Environment Variables
```bash
cp .env.example .env
```
แก้ไขไฟล์ `.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
> ดึงค่าได้จาก **Supabase Dashboard > Settings > API**

### 4) รันโปรเจกต์
```bash
npm run dev
```
เปิดเว็บที่ http://localhost:5173

### 5) Build production
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Schema

### `posts`
| column         | type        | note                          |
|----------------|-------------|-------------------------------|
| id             | uuid (PK)   | auto                          |
| title          | text        | required                      |
| content        | text        | เนื้อหาแบบย่อ/เต็ม               |
| image_url      | text        | URL จาก Supabase Storage      |
| external_link  | text        | ลิงก์ปุ่ม "อ่านต่อ"            |
| created_at     | timestamptz | auto                          |
| updated_at     | timestamptz | auto-update via trigger       |

### `platform_links`
| column        | type      | note                                |
|---------------|-----------|-------------------------------------|
| id            | uuid (PK) | auto                                |
| platform      | text      | unique: facebook/tiktok/instagram/x/youtube |
| url           | text      | nullable (ว่าง = ซ่อน)               |
| display_order | int       | ลำดับการแสดงผล                       |
| updated_at    | timestamptz | auto                              |

### Storage Bucket: `post-images`
- Public bucket
- รูปจะถูกอัปโหลดด้วยชื่อ `{timestamp}-{random}.{ext}`

### RLS (Row Level Security)
- **ทุกคน**: อ่าน `posts`, `platform_links`, รูปใน bucket
- **เฉพาะ authenticated**: insert/update/delete + อัปโหลด/ลบรูป

---

## 🔑 Routes

| Path        | Description                | Protected |
|-------------|----------------------------|-----------|
| `/`         | หน้าแรก (public)            | ❌        |
| `/login`    | หน้าล็อกอินหลังบ้าน          | ❌        |
| `/admin`    | Dashboard จัดการโพสต์/โซเชียล | ✅        |

---

## 🎨 Design Tokens

```js
// Tailwind
accent:        '#DC2626'  // ปุ่ม/ลิงก์/highlight
accent-hover:  '#B91C1C'
fontFamily:    'Inter', 'Plus Jakarta Sans', 'Prompt'
```

Glassmorphism utility:
```css
.glass {
  bg-white/60 backdrop-blur-xl border border-white/40 shadow-glass
}
```

---

## 📝 หมายเหตุ

- หากเห็น console เตือน `⚠️ Supabase env not set` → ยังไม่ได้ตั้ง `.env`
- การเพิ่ม admin: ทำผ่าน **Supabase Dashboard > Authentication > Users**
  (ตอนนี้ระบบไม่มีหน้าสมัครสมาชิก เพื่อความปลอดภัย)
- หากต้องการเพิ่ม platform โซเชียลใหม่ ให้แก้:
  - `src/components/admin/SocialManager.jsx` → array `PLATFORMS`
  - `src/components/SocialSection.jsx` → `ICON_MAP`

---

## 📦 Dependencies หลัก

- React 18 + React Router 6
- Vite 5
- Tailwind CSS 3
- Framer Motion 11
- @supabase/supabase-js 2
- lucide-react (icons)

---

Made with ❤️ — Surasith.online
