# 🌿 EcoCalc - Karbon Ayak İzi ve ROI Skorkartı

**EcoCalc**, KOBİ'ler ve kurumlar için geliştirilmiş, tek sayfalık bir karbon ve enerji analiz aracıdır. Uygulama; aylık enerji tüketim verilerinden yıllık emisyon, enerji maliyeti, GES (Güneş Enerjisi Santrali) tasarruf potansiyeli ve yatırım geri dönüş süresini (ROI) anlık olarak hesaplar.

🚀 **Canlı Uygulama:** [https://ecocalc-tez.vercel.app/](https://ecocalc-tez.vercel.app/)

## ✨ Özellikler

- **Anlık Analiz:** Tek ekranda hızlı veri girişi ve eş zamanlı sonuç paneli.
- **Görsel Raporlama:** Emisyon dağılımı için `Recharts` tabanlı dinamik pasta grafik.
- **Yatırım Analizi:** GES projeleri için özelleştirilmiş amortisman süresi (ROI) hesaplaması.
- **Ekolojik Göstergeler:** Yıllık enerji gideri ve karbon emisyonuna eş değer ağaç sayısı gösterimi.
- **Modern Tasarım:** CleanTech temalı, kullanıcı dostu ve kart tabanlı arayüz (`Tailwind CSS`).

## 🛠️ Teknoloji Yığını

- **Framework:** `Vite` + `React`
- **Dil:** `TypeScript`
- **Stil:** `Tailwind CSS`
- **Grafik:** `Recharts`
- **İkonlar:** `lucide-react`
- **Yayınlama:** `Vercel`

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js** (LTS sürümü önerilir)
- **npm** veya **yarn**

### Yerel Kurulum
1. Proje klasörüne gidin ve paketleri kurun:
```bash
npm install`

## Proje Yapisi

```text
ecocalc-tez/
  src/
    App.tsx
    main.tsx
    styles/
      index.css
    lib/
      ecocalc.ts
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  postcss.config.cjs
```

## Notlar

- Hesaplamalar yaklasik ve simulasyon amaclidir.
- Cikan sonuclar yatirim/muhendislik karari icin tek basina kullanilmamalidir.
- Birim katsayilari bolgesel senaryolara gore degisebilir.

## Lisans

Bu proje tez calismasi kapsaminda gelistirilmistir.

