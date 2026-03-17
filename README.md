# desdracin

![Preview](public/preview.png)

desdracin adalah platform kurasi short drama yang merangkum beberapa sumber populer ke pengalaman browsing yang lebih rapi, cepat, dan berbeda secara visual.

## Persyaratan Sistem
Sebelum memulai, pastikan komputer Anda sudah terinstall:
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau 20 LTS disarankan)
- Git (Opsional)

## Panduan Instalasi (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

### 1. Clone Repository
1. Buka terminal (Command Prompt/PowerShell).
2. Clone repository ini ke komputer Anda:
   ```bash
   git clone https://github.com/naonyeer/dracin.git
   ```
3. Masuk ke folder project:
   ```bash
   cd dracin
   ```

### 2. Install Dependencies
Install semua library yang dibutuhkan project ini:
```bash
npm install
# atau jika menggunakan yarn
yarn install
# atau pnpm
pnpm install
```

### 3. Konfigurasi Environment Variable
Salin file bernama `.env.example` menjadi `.env`

### 4. Jalankan Development Server
Mulai server lokal untuk pengembangan:
```bash
npm run dev
```

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## Script Perintah
| Command | Fungsi |
|---------|--------|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Cek error coding style (Linting) |

## Struktur Folder
```text
src/
├── app/                    # Halaman & Routing (Next.js App Router)
├── api/                    # API routes untuk integrasi backend
├── detail/                 # Halaman detail tiap platform
├── watch/                  # Halaman player video
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Helper functions dan utilitas
├── types/                  # TypeScript types
└── styles/                 # Global styles
```
