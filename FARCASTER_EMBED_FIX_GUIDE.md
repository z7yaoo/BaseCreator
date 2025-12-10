# คู่มือแก้ปัญหา Farcaster Embed Valid ✕

## สาเหตุหลักที่ทำให้ Embed Valid ✕

1. **รูป splash.png ไม่ใช่ PNG จริง** (เป็น JPEG ที่เปลี่ยนนามสกุลเป็น .png)
2. **Aspect ratio ไม่ใช่ 3:2** (ต้องเป็น 1200x800, 1500x1000, ฯลฯ)
3. **ขาด meta tags ที่ถูกต้อง** (fc:miniapp และ fc:frame แบบ JSON)
4. **URL ไม่ตรงกับ domain จริง**

---

## ขั้นตอนที่ 1: เช็คและแก้ไขรูปภาพ

### 1.1 เช็คว่ารูปเป็น PNG จริงหรือไม่

```bash
# เช็ค format จริงของรูป (ต้องรันใน macOS/Linux)
sips -g format public/splash.png
```

**ถ้าขึ้น `format: jpeg`** แสดงว่าเป็น JPEG ไม่ใช่ PNG จริง!

### 1.2 แปลงเป็น PNG จริงและปรับ aspect ratio เป็น 3:2 (1200x800)

```bash
# แปลง splash.png ให้เป็น PNG จริงและปรับเป็น 1200x800
sips -s format png public/splash.png --out public/splash-temp.png
sips -z 800 1200 public/splash-temp.png --out public/splash.png
rm public/splash-temp.png

# เช็คอีกครั้งว่าถูกต้อง
sips -g pixelWidth -g pixelHeight -g format public/splash.png
```

**ผลลัพธ์ที่ถูกต้องต้องเป็น:**
```
pixelWidth: 1200
pixelHeight: 800
format: png
```

### 1.3 ถ้าไม่มีรูป splash.png ให้สร้างจากรูปอื่น

```bash
# สร้างจาก icon.png หรือ logo.png หรือ banner.png
if [ -f public/icon.png ]; then
  sips -s format png public/icon.png --out public/splash-temp.png
  sips -z 800 1200 public/splash-temp.png --out public/splash.png
  rm public/splash-temp.png
elif [ -f public/logo.png ]; then
  sips -s format png public/logo.png --out public/splash-temp.png
  sips -z 800 1200 public/splash-temp.png --out public/splash.png
  rm public/splash-temp.png
elif [ -f public/banner.png ]; then
  sips -s format png public/banner.png --out public/splash-temp.png
  sips -z 800 1200 public/splash-temp.png --out public/splash.png
  rm public/splash-temp.png
else
  echo "ไม่มีรูปต้นฉบับ กรุณาเพิ่มรูปก่อน"
fi
```

---

## ขั้นตอนที่ 2: เพิ่ม Meta Tags ที่ถูกต้อง

### 2.1 หาไฟล์ layout.tsx

```bash
# หาว่า layout.tsx อยู่ที่ไหน (อาจเป็น app/layout.tsx หรือ src/app/layout.tsx)
find . -name "layout.tsx" -not -path "*/node_modules/*" | head -1
```

### 2.2 แก้ไข layout.tsx - เพิ่ม fc:miniapp และ fc:frame

**ค้นหาส่วน `metadata` ใน layout.tsx และแก้ตามนี้:**

**ก่อนแก้:**
```typescript
export const metadata: Metadata = {
  title: "Your App",
  description: "Your description",
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${APP_URL}/og-image.png`,
    // ...
  },
}
```

**หลังแก้:**
```typescript
const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://your-domain.vercel.app';

export const metadata: Metadata = {
  title: "Your App",
  description: "Your description",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Your App",
    description: "Your description",
    images: [`${APP_URL}/splash.png`],
    url: APP_URL,
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Open App",
        action: {
          type: "launch_miniapp",
          name: "Your App Name",
          url: APP_URL
        }
      }
    }),
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "Your App Name",
          url: APP_URL
        }
      }
    }),
  },
}
```

**สิ่งสำคัญ:**
- ✅ ใช้ `JSON.stringify()` สำหรับ fc:miniapp และ fc:frame
- ✅ `version: "1"` (ต้องเป็น string "1" ไม่ใช่ number)
- ✅ ต้องมี `action.name` ใน button
- ✅ ต้องมี `action.type` เป็น "launch_miniapp" และ "launch_frame"
- ✅ URL ต้องเป็น absolute URL (https://...)
- ✅ imageUrl ต้องชี้ไปที่ splash.png ที่เป็น 3:2 ratio

---

## ขั้นตอนที่ 3: เพิ่ม Cache-Control Headers

### 3.1 แก้ไข next.config.js หรือ next.config.ts

**ค้นหาไฟล์:**
```bash
ls next.config.*
```

**เพิ่ม headers function:**

**ถ้าเป็น next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... config เดิม
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

**ถ้าเป็น next.config.ts:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... config เดิม
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
```

---

## ขั้นตอนที่ 4: ตรวจสอบ URL ให้ตรงกับ Vercel Domain

### 4.1 เช็คว่า APP_URL ตรงกับ domain จริงหรือไม่

```bash
# เช็ค Vercel project
cat .vercel/project.json

# เช็ค environment variable ใน layout.tsx
grep "NEXT_PUBLIC" app/layout.tsx || grep "NEXT_PUBLIC" src/app/layout.tsx
```

**ให้แน่ใจว่า:**
- `process.env.NEXT_PUBLIC_URL` มีค่าเป็น domain จริงของคุณ
- หรือใช้ fallback เป็น domain จริง เช่น `'https://your-app.vercel.app'`

### 4.2 ถ้าใช้หลาย domain ให้ตั้งค่า environment variable

```bash
# เพิ่มใน .env.local หรือ .env
NEXT_PUBLIC_URL=https://your-actual-domain.vercel.app
```

---

## ขั้นตอนที่ 5: Deploy และทดสอบ

### 5.1 Commit และ Push

```bash
git add .
git commit -m "Fix Farcaster embed validation - update splash.png to 3:2 ratio and add proper meta tags"
git push
```

### 5.2 Deploy to Vercel

```bash
npx vercel --prod --yes
```

### 5.3 อัพเดท alias (ถ้าจำเป็น)

```bash
# แทนที่ DEPLOYMENT_URL ด้วย URL ที่ได้จาก vercel deploy
npx vercel alias set DEPLOYMENT_URL your-domain.vercel.app
```

### 5.4 ทดสอบที่ Farcaster Embed Tool

1. ไปที่ https://miniapps.farcaster.xyz/embed-tool
2. ใส่ URL ของคุณ
3. ตรวจสอบว่าทั้ง 4 ข้อเป็น ✓:
   - ✓ HTTP Status 200
   - ✓ Cache Header
   - ✓ Embed Present
   - ✓ Embed Valid

---

## สรุป Checklist สำหรับทุกโปรเจค

### ✅ รูปภาพ (splash.png)
- [ ] เป็น PNG จริง (ไม่ใช่ JPEG ที่เปลี่ยนนามสกุล)
- [ ] ขนาด 1200x800 pixels (aspect ratio 3:2)
- [ ] ไฟล์ขนาดน้อยกว่า 10MB
- [ ] อยู่ใน public/splash.png

### ✅ Meta Tags (layout.tsx)
- [ ] มี fc:miniapp แบบ JSON.stringify()
- [ ] มี fc:frame แบบ JSON.stringify()
- [ ] version เป็น "1" (string)
- [ ] มี action.name ใน button
- [ ] มี action.type ("launch_miniapp" และ "launch_frame")
- [ ] imageUrl เป็น absolute URL (https://...)
- [ ] url เป็น absolute URL (https://...)

### ✅ Cache Headers (next.config.js/ts)
- [ ] มี async headers() function
- [ ] ตั้ง Cache-Control: public, max-age=3600

### ✅ URL Configuration
- [ ] APP_URL ตรงกับ domain จริงบน Vercel
- [ ] ไม่มี typo ใน URL
- [ ] ทุก URL เป็น https:// (ไม่ใช่ http://)

---

## ข้อผิดพลาดที่พบบ่อย

### ❌ ผิด: splash.png เป็น JPEG ที่เปลี่ยนนามสกุล
```bash
# เช็คด้วย
sips -g format public/splash.png
# ถ้าได้ "format: jpeg" = ผิด!
```
**แก้:** ใช้คำสั่ง sips แปลงเป็น PNG จริง (ดูขั้นตอนที่ 1.2)

### ❌ ผิด: Aspect ratio ไม่ใช่ 3:2
```bash
# เช็คด้วย
sips -g pixelWidth -g pixelHeight public/splash.png
# ถ้าได้ 1024x1024 (1:1) = ผิด!
```
**แก้:** ปรับเป็น 1200x800 (ดูขั้นตอนที่ 1.2)

### ❌ ผิด: Meta tags ไม่ใช่ JSON
```typescript
// ผิด - ไม่มี JSON.stringify
'fc:miniapp': {
  version: "1",
  imageUrl: "..."
}

// ถูก - ต้องมี JSON.stringify
'fc:miniapp': JSON.stringify({
  version: "1",
  imageUrl: "..."
})
```

### ❌ ผิด: ขาด action.name
```typescript
// ผิด
button: {
  title: "Open App",
  action: {
    type: "launch_miniapp",
    url: APP_URL
  }
}

// ถูก
button: {
  title: "Open App",
  action: {
    type: "launch_miniapp",
    name: "Your App Name",  // ← ต้องมี
    url: APP_URL
  }
}
```

### ❌ ผิด: version เป็น number
```typescript
// ผิด
version: 1

// ถูก
version: "1"
```

### ❌ ผิด: URL ไม่ตรงกับ domain
```typescript
// ผิด - domain ไม่ตรง
const APP_URL = 'https://old-domain.vercel.app'
// แต่จริงๆ deploy ที่ new-domain.vercel.app

// ถูก
const APP_URL = 'https://new-domain.vercel.app'
```

---

## คำสั่งรวมสำหรับ Copy-Paste (All-in-One)

```bash
# 1. แปลงและปรับขนาดรูป splash.png เป็น PNG 1200x800
sips -s format png public/splash.png --out public/splash-temp.png && \
sips -z 800 1200 public/splash-temp.png --out public/splash.png && \
rm public/splash-temp.png && \
echo "✅ Splash image converted to PNG 1200x800"

# 2. เช็คว่าถูกต้อง
sips -g pixelWidth -g pixelHeight -g format public/splash.png

# 3. หลังจากแก้ layout.tsx และ next.config แล้ว deploy
git add . && \
git commit -m "Fix Farcaster embed - 3:2 ratio splash.png + proper meta tags" && \
git push && \
npx vercel --prod --yes
```

---

## Template สำหรับ layout.tsx (Copy-Paste พร้อมใช้)

```typescript
import type { Metadata } from 'next'

// ⚠️ เปลี่ยน URL นี้เป็น domain จริงของคุณ!
const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://YOUR-DOMAIN.vercel.app';

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Your App Name",
    description: "Your app description",
    images: [`${APP_URL}/splash.png`],
    url: APP_URL,
  },
  other: {
    // ⚠️ ถ้ามี base:app_id ให้ใส่ที่นี่
    // 'base:app_id': 'your-app-id',

    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Open App",
        action: {
          type: "launch_miniapp",
          name: "Your App Name",  // ⚠️ เปลี่ยนเป็นชื่อแอปคุณ
          url: APP_URL
        }
      }
    }),
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "Your App Name",  // ⚠️ เปลี่ยนเป็นชื่อแอปคุณ
          url: APP_URL
        }
      }
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## หมายเหตุสำคัญ

1. **CDN Cache**: หลัง deploy ใหม่ อาจต้องรอ 5-10 นาทีให้ CDN อัพเดท cache
2. **Hard Refresh**: ลอง clear cache browser (Ctrl+Shift+R หรือ Cmd+Shift+R)
3. **Vercel Alias**: ถ้า deploy แล้วใช้ URL ชั่วคราว ต้องรัน `vercel alias` เพื่ออัพเดท production domain
4. **Image Format**: ต้องเป็น PNG จริง ไม่ใช่ JPEG ที่เปลี่ยนนามสกุล! ใช้ `sips` เช็คได้

---

## ถ้ายังไม่ผ่าน

1. เช็คว่า splash.png เป็น PNG จริงด้วย `sips -g format`
2. เช็คว่า meta tags มี JSON.stringify() และครบถ้วน
3. เช็คว่า URL ตรงกับ domain ที่ deploy จริง
4. รอ 10 นาทีแล้วลองใหม่ (CDN cache)
5. ลอง deploy ใหม่อีกครั้ง

---

**Good luck! 🚀**
