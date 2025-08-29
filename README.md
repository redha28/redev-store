# Redev Store

Redev Store adalah aplikasi manajemen produk yang dibangun dengan arsitektur modern menggunakan
**NestJS** untuk backend dan **Vue.js** untuk frontend. Aplikasi ini menggunakan **MySQL** sebagai
database utama dan **Redis** untuk caching.

## 🏗️ Arsitektur Aplikasi

### Backend (NestJS)

- **Framework**: NestJS (Node.js)
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Token)
- **API Documentation**: Swagger/OpenAPI
- **Port**: 3000

### Frontend (Vue.js)

- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Port**: 80 (dalam container)

## 📋 Prasyarat

Sebelum menjalankan aplikasi, pastikan sistem Anda memiliki:

- **Docker** (versi 20.10 atau lebih baru)
- **Docker Compose** (versi 1.29 atau lebih baru)
- **Git** (untuk cloning repository)

## 🚀 Cara Menjalankan Aplikasi dengan Docker Compose

### 1. Clone Repository

```bash
git clone <repository-url>
cd "redev store"
```

### 2. Konfigurasi Environment Variables

Buat file `.env` di root directory project (sejajar dengan `docker-compose.yml`):

```bash
# Frontend Configuration
FRONTEND_PORT=3001
VITE_API_BASE_URL=http://localhost:3000

# Backend Configuration
BACKEND_PORT=3000

# Database Configuration
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=SecurePassword123!
DATABASE_NAME=redev_store

# MySQL Configuration
MYSQL_ROOT_PASSWORD=SecurePassword123!
MYSQL_DATABASE=redev_store
MYSQL_PORT=3307

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Konfigurasi Backend Environment

Buat file `.env` di dalam folder `backend/`:

```bash
# Application
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-very-long-string
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-very-long-string
JWT_EXPIRES_IN=15m

# Database Configuration
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=SecurePassword123!
DATABASE_NAME=redev_store

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Logging
LOG_LEVEL=info
```

### 4. Konfigurasi Frontend Environment

Buat file `.env` di dalam folder `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 5. Jalankan Aplikasi

```bash
# Jalankan semua services
docker compose up -d --build

```

### 6. Verifikasi Aplikasi Berjalan

Setelah semua container berjalan, Anda dapat mengakses:

- **Frontend**: http://localhost:5137
- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **MySQL**: localhost:3307
- **Redis**: localhost:6380

## 📚 Perintah Docker Compose Berguna

### Menghentikan Aplikasi

```bash
docker-compose down
```

### Menghentikan dan Menghapus Volume

```bash
docker-compose down -v
```

### Melihat Status Container

```bash
docker-compose ps
```

### Melihat Logs

```bash
# Semua services
docker-compose logs

# Service tertentu
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
docker-compose logs redis
```

### Restart Service Tertentu

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild Container

```bash
# Rebuild semua container
docker-compose up --build

# Rebuild container tertentu
docker-compose up --build backend
```

## 🗄️ Database & Seeding

Aplikasi akan secara otomatis:

1. **Menjalankan Migrasi Database**: Membuat tabel-tabel yang diperlukan
2. **Seeding Data**: Mengisi database dengan data awal (kategori produk dan produk sample)

Data seeding meliputi:

- Kategori produk (Electronics, Fashion, Books, dll.)
- Produk sample untuk setiap kategori

## 🔧 Development Mode

Untuk development, Anda dapat menjalankan frontend dan backend secara terpisah:

### Backend Development

```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### Container Tidak Bisa Start

```bash
# Check logs untuk error
docker-compose logs

# Restart semua services
docker-compose restart

# Rebuild jika ada perubahan code
docker-compose up --build
```

### Database Connection Error

```bash
# Pastikan MySQL container berjalan
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL container
docker-compose restart mysql
```

### Port Sudah Digunakan

Jika port sudah digunakan, ubah port di file `.env`:

```bash
FRONTEND_PORT=3002  # Ganti dari 3001
BACKEND_PORT=3001   # Ganti dari 3000
MYSQL_PORT=3308     # Ganti dari 3307
```

### Reset Database

```bash
# Stop containers dan hapus volume
docker-compose down -v

# Start ulang (akan create database baru)
docker-compose up -d
```

## 📁 Struktur Project

```
redev-store/
├── docker-compose.yml          # Docker Compose configuration
├── README.md                   # Documentation
├── .env                        # Environment variables
├── backend/                    # NestJS Backend
│   ├── dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── modules/            # Feature modules
│       ├── entities/           # Database entities
│       ├── migrations/         # Database migrations
│       └── seeds/              # Database seeders
└── frontend/                   # Vue.js Frontend
    ├── dockerfile
    ├── package.json
    ├── .env
    └── src/
        ├── components/         # Vue components
        ├── pages/              # Page components
        ├── stores/             # Pinia stores
        └── api/                # API services
```

## 🔐 Authentication

Aplikasi menggunakan JWT (JSON Web Token) untuk authentication:

- **Access Token**: Berlaku selama 15 menit
- **Refresh Token**: Untuk memperbarui access token
- **Protected Routes**: Beberapa endpoint memerlukan authentication

### Default User (Setelah Seeding)

Cek di backend seeder files untuk informasi user default.

## 🌟 Fitur Utama

- ✅ **Manajemen Produk**: CRUD operations untuk produk
- ✅ **Kategori Produk**: Organisasi produk berdasarkan kategori
- ✅ **Authentication**: Login/logout dengan JWT
- ✅ **Pagination**: Navigasi data dengan pagination
- ✅ **Search & Filter**: Pencarian dan filtering produk
- ✅ **Responsive Design**: UI yang responsif untuk berbagai perangkat
- ✅ **API Documentation**: Swagger UI untuk dokumentasi API

## 📞 Support

Jika mengalami masalah atau membutuhkan bantuan, silakan:

1. Check troubleshooting section di atas
2. Lihat logs container dengan `docker-compose logs`
3. Pastikan semua environment variables sudah dikonfigurasi dengan benar
4. Verifikasi Docker dan Docker Compose sudah terinstall dengan benar

---

**Happy Coding! 🎉**
