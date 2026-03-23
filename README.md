# EcoCalc - Karbon Ayak Izi ve ROI Skorkarti

EcoCalc, KOBI'ler ve kurumlar icin gelistirilmis tek sayfalik bir karbon ve enerji analiz aracidir.  
Uygulama; aylik enerji tuketim verilerinden yillik emisyon, enerji maliyeti, GES tasarruf potansiyeli ve geri donus suresi (ROI) hesaplar.

## Ozellikler

- Tek ekranda hizli veri girisi ve anlik sonuc paneli
- Emisyon dagilimi icin `Recharts` tabanli pasta grafik
- GES yatirimi icin ROI (amortisman suresi) hesaplamasi
- Yillik enerji gideri ve agac esdegeri gostergeleri
- CleanTech temali modern, kart tabanli arayuz (`Tailwind CSS`)

## Teknoloji Yigini

- `Vite`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `Recharts`
- `lucide-react`

## Gereksinimler

- `Node.js` (LTS onerilir)
- `npm`

## Kurulum

Proje klasorunde:

```bash
npm install
```

## Gelistirme Ortami

```bash
npm run dev
```

Varsayilan adres: `http://localhost:5173`

## Uretim Build

```bash
npm run build
```

Build onizleme:

```bash
npm run preview
```

## Kullanim

1. Sol panelden aylik tuketim ve birim fiyat alanlarini doldurun:
   - Elektrik (kWh, TL/kWh)
   - Dogalgaz (m3, TL/m3)
   - Akaryakit (Litre, TL/L)
   - GES kapasitesi (kWp)
   - GES kurulum maliyeti (TL)
2. Sag panelde su degerler anlik guncellenir:
   - Yillik karbon ayak izi (Ton CO2)
   - Emisyon kaynak dagilimi (pasta grafik)
   - GES ROI (yil)
   - Simulasyon oncesi yillik enerji gideri

## Hesaplama Mantigi

Uygulamadaki temel hesaplamalar:

- **Yillik karbon ayak izi (Ton CO2)**  
  `(Aylik Elektrik * 0.45 + Aylik Dogalgaz * 2.01 + Aylik Akaryakit * 2.68) * 12 / 1000`

- **Gereken agac sayisi (yaklasik)**  
  `Yillik karbon (kg) / 45`

- **Yillik enerji gideri (TL)**  
  `12 * (Elektrik maliyeti + Dogalgaz maliyeti + Akaryakit maliyeti)`

- **GES yillik elektrik uretim varsayimi**  
  `1 kWp ~ 1400 kWh / yil`

- **Yillik elektrik tasarrufu (TL)**  
  `GES yillik uretim * Elektrik birim fiyat`

- **ROI (yil)**  
  `GES kurulum maliyeti / Yillik elektrik tasarrufu`

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

