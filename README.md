# MiniShop - Kafe Sipariş Sistemi

Bu proje, SQL ve veritabanı tasarımı bilgimi uygulamalı olarak pekiştirmek amacıyla başladığım, ardından gerçek bir backend ve arayüz üzerinde (ASP.NET Core Web API + Entity Framework Core + React) genişlettiğim bir çalışmadır.

## Projenin Amacı

MiniShop, bir iş yeri kafeteryasının online menü ve sipariş takip sistemini simüle eder: çalışanlar kategorilere ayrılmış ürünleri (kahveler, soğuk içecekler, tatlılar, atıştırmalıklar) görür, kendi isimlerini yazıp sipariş verir; kafe görevlisi ürünleri/kategorileri yönetir ve gelen siparişleri takip eder. Bu senaryo üzerinden müşteriler, ürünler, kategoriler, siparişler ve sipariş detayları arasındaki ilişkileri modelleyen bir veritabanı ve bu veritabanı üzerinde çalışan bir REST API + web arayüzü geliştirdim.

## Üç Katman

### 1) Ham SQL (`database/` klasörü)

SQL eğitiminde işlenen konuların doğrudan T-SQL ile uygulandığı kısım:

- Veritabanı ve tablo oluşturma (`01_create_database.sql`, `02_create_tables.sql`)
- Primary key, foreign key, unique ve check constraint kullanımı
- `INSERT`, `UPDATE`, `DELETE` işlemleri (`03_insert_sample_data.sql`)
- `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY` sorguları
- `INNER JOIN` ve `LEFT JOIN` kullanımı
- Toplam satış, stok ve müşteri sipariş raporları
- View (`vw_ProductSales`) ve stored procedure (`sp_GetCustomerOrders`) örnekleri
- CTE (`WITH`), `ROW_NUMBER() OVER (PARTITION BY ...)`, `UPDATE ... FROM ... JOIN` ve `CASE`
  ifadesiyle ürünlere kategoriye uygun görsel atama (`05_update_product_images.sql`)

Çalıştırmak için (SQL Server Management Studio veya `sqlcmd` ile), dosyaları sırasıyla çalıştırmak yeterli:

```
sqlcmd -S localhost\SQLEXPRESS -E -i database/01_create_database.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/02_create_tables.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/03_insert_sample_data.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/04_queries.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/05_update_product_images.sql
```

### 2) ASP.NET Core Web API (`src/MiniShop.Api`)

Aynı veri modelinin Entity Framework Core ile kod üzerinden yönetildiği, gerçek bir REST API katmanı:

- Categories, Products, Customers, Orders için CRUD uç noktaları
- Sipariş oluşturma sırasında otomatik stok kontrolü ve toplam tutar hesaplama
- EF Core Migrations ile veritabanı şemasının kod üzerinden yönetimi
- Swagger UI ile interaktif API dokümantasyonu ve test
- Web arayüzünün erişebilmesi için CORS ayarı

Çalıştırmak için:

```
dotnet run --project src/MiniShop.Api
```

sonra tarayıcıdan `https://localhost:7154/swagger` adresine gidilebilir. Bağlantı dizesi `src/MiniShop.Api/appsettings.json` içinde tanımlı (varsayılan: `localhost\SQLEXPRESS`).

### 3) React Web Arayüzü (`src/MiniShop.Web`)

Material UI ile hazırlanmış, ikiye ayrılmış web arayüzü:

- **Sipariş Ver** (çalışan görünümü): kategorilere göre ürün/görsel listesi (tıklanınca ilgili
  kategoriye kayan üst navigasyon ile), kendi isminizi yazarak sipariş oluşturma — isim
  sistemde yoksa otomatik yeni müşteri olarak kaydedilir, varsa mevcut kayıt kullanılır
- **Yönetim Paneli** (kafe görevlisi görünümü, `1234` PIN'i ile korunur): Ürünler (ekle/sil),
  Kategoriler (ekle), Tüm Siparişler (listeleme)
- Ürün görselleri, Wikimedia Commons'tan alınan gerçek fotoğraflardır; veritabanında
  saklanır (bkz. `05_update_product_images.sql`) ve kategoriye göre otomatik seçilen bir
  yedek görselle desteklenir

Çalıştırmak için (backend zaten çalışır durumda olmalı):

```
cd src/MiniShop.Web
npm install
npm run dev
```

sonra tarayıcıdan `http://localhost:5173` adresine gidilebilir.

## Klasör Yapısı

```text
MiniShop/
|-- database/
|   |-- 01_create_database.sql
|   |-- 02_create_tables.sql
|   |-- 03_insert_sample_data.sql
|   |-- 04_queries.sql
|   `-- 05_update_product_images.sql
|-- diagrams/
|   `-- database-diagram.md
|-- src/
|   |-- MiniShop.Api/      (ASP.NET Core Web API + EF Core)
|   `-- MiniShop.Web/      (React + Material UI arayüzü)
`-- README.md
```

## Durum

Veritabanı şeması, örnek veriler, API'nin CRUD/iş kuralları ve web arayüzü (sipariş verme +
yönetim paneli) tamamlandı ve test edildi.

## Geliştiren

Ayşe Mandıralı - [GitHub](https://github.com/aysemandirali)
