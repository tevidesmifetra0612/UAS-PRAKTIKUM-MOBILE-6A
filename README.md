# KampusMarket 🛍️

MVP marketplace jual-beli barang bekas mahasiswa, dibuat dengan **React Native + Expo (Expo Router, TypeScript)** untuk memenuhi tugas UAS Praktikum Pemrograman Mobile. Data produk & simulasi login memakai API publik [DummyJSON](https://dummyjson.com/products) — tidak ada backend sendiri.

## Fitur

- **Login / Daftar Akun** dengan validasi form (nama, format email, panjang password) dan toggle mode Masuk/Daftar.
- **Katalog Produk** (Home) — grid 2 kolom dengan `FlatList`, pencarian realtime (debounced), filter kategori (chip horizontal), pull-to-refresh, dan infinite scroll (pagination `limit`/`skip`).
- **Detail Produk** — gambar, harga, rating, stok, deskripsi, tombol tambah ke keranjang.
- **Keranjang/Wishlist** — tambah/hapus produk, badge jumlah di tab, total harga.
- **Profil** — info akun, ringkasan keranjang, tombol logout.
- **Auth Gate** — halaman `(tabs)` hanya bisa diakses setelah login; sesi disimpan di `AsyncStorage` sehingga tetap login setelah reload.
- **Status jaringan eksplisit** di setiap layar yang mengambil data: loading, sukses, error (dengan tombol "Coba lagi") — aplikasi tidak pernah crash saat gagal fetch.

## Cara Install & Run

```bash
npm install
npx expo start
```

Lalu pilih menjalankan di Android emulator, iOS simulator, Expo Go (scan QR), atau tekan `w` untuk web.

## Kredensial Demo (Login)

```
Username: emilys@gmail.com
Password: emilyspass
```

Form login sudah terisi otomatis dengan kredensial di atas. DummyJSON `auth/login` sebenarnya mengenal username `emilys` (bukan format email), jadi permintaan ke API asli akan ditolak — aplikasi otomatis fallback ke sesi simulasi lokal (lihat komentar di `context/AuthContext.tsx`) supaya demo tidak terhambat selama form lolos validasi (format email + password minimal 6 karakter).

Mode **Daftar** disimulasikan sepenuhnya di sisi klien (DummyJSON tidak punya endpoint register sungguhan): setelah validasi lolos, akun langsung dianggap dibuat dan login.

## Endpoint DummyJSON yang Dipakai

| Fungsi | Endpoint |
|---|---|
| Daftar produk + pagination | `GET /products?limit=&skip=` |
| Cari produk | `GET /products/search?q=` |
| Daftar kategori | `GET /products/category-list` |
| Produk per kategori | `GET /products/category/{slug}` |
| Detail produk | `GET /products/{id}` |
| Login | `POST /auth/login` |

Semua fungsi ada di [`services/api.ts`](services/api.ts), lengkap dengan `try/catch` dan pesan error yang rapi.

## Struktur Folder

```
app/
  _layout.tsx            # root layout: AuthProvider + CartProvider, Stack navigator
  index.tsx               # redirect ke /login atau /(tabs) sesuai status login
  login.tsx                # halaman Login/Daftar (auth gate)
  (tabs)/
    _layout.tsx            # bottom tab navigator (Home, Keranjang, Profil) + auth gate
    index.tsx               # Home = Katalog Produk (FlatList, search, filter)
    cart.tsx                 # Keranjang/Wishlist
    profile.tsx               # Profil + Logout
  product/[id].tsx            # Detail Produk
components/
  AppButton.tsx      # tombol reusable (variant primary/outline, loading, disabled)
  AppInput.tsx        # input reusable (label, error text, secureTextEntry)
  ProductCard.tsx      # kartu produk reusable (gambar, judul, harga, rating, tombol keranjang)
  LoadingView.tsx        # state loading generik
  ErrorView.tsx            # state error + tombol "Coba lagi"
  EmptyView.tsx              # state kosong generik
context/
  AuthContext.tsx     # sesi user (login/register/logout) + persist ke AsyncStorage
  CartContext.tsx      # state keranjang global (tambah/hapus, total)
services/
  api.ts              # semua fetch ke DummyJSON
constants/
  theme.ts            # warna, spacing, radius, font, shadow (tema konsisten)
utils/
  validation.ts       # validasi form auth + custom hook useDebounce
```

## Pemetaan Fitur ke Aspek Penilaian

| Aspek (bobot) | Implementasi |
|---|---|
| **Layout & Komponen (25)** | 3 halaman utama (Login, Home/Katalog, Detail Produk) memakai Flexbox murni, grid produk 2 kolom responsif. Komponen reusable: `AppButton`, `AppInput`, `ProductCard`, `LoadingView`, `ErrorView`, `EmptyView`. |
| **Lists & State Management (25)** | `FlatList` (bukan ScrollView+map) dengan `keyExtractor`, `ListEmptyComponent`, `RefreshControl`, `onEndReached` untuk infinite scroll. Pencarian realtime via `useDebounce` (~400ms), filter kategori via `FlatList` horizontal, dikombinasikan dengan `useState`/`useEffect`/`useMemo`/`useCallback`. |
| **Form & Navigasi (30)** | Form Login/Daftar dengan validasi per field (`utils/validation.ts`). Bottom tab (Home, Keranjang, Profil) dengan ikon `@expo/vector-icons`. Auth gate di `app/index.tsx` dan `app/(tabs)/_layout.tsx` — tidak bisa akses tab tanpa login. Navigasi ke Detail Produk via `router.push`. |
| **Networking & API (15)** | Semua fetch di `services/api.ts` dengan `try/catch`. Setiap layar data punya 3 state eksplisit (loading/success/error) dan tombol "Coba lagi", tanpa crash. |
| **Kualitas Kode & Git (5)** | TypeScript strict, komponen kecil tanpa duplikasi, tema terpusat di `constants/theme.ts`, riwayat commit bertahap (setup → komponen → list & state → form & auth → cart → networking polish). |

## Catatan Teknis

- Boleh pakai AI Assistant sebagai alat bantu pengembangan (Claude Code), sesuai ketentuan tugas.
- Package Expo diinstal via `npx expo install` agar versi selalu kompatibel dengan SDK yang dipakai (Expo SDK 54).
