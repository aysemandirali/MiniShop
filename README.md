# MiniShop - Kafe Siparis Sistemi

Bu proje, SQL ve veritabani tasarimi bilgimi uygulamali olarak pekistirmek amaciyla basladigim, ardindan gercek bir backend ve arayuz uzerinde (ASP.NET Core Web API + Entity Framework Core + React) genisletildigim bir calismadir.

## Projenin Amaci

MiniShop, bir kafenin online menu ve siparis takip sistemini simule eder: musteriler kategorilere ayrilmis urunleri (kahveler, soguk icecekler, tatlilar, atistirmaliklar) gorur ve siparis verir; kafe sahibi siparisleri ve stok durumunu takip eder. Bu senaryo uzerinden musteriler, urunler, kategoriler, siparisler ve siparis detaylari arasindaki iliskileri modelleyen bir veritabani ve bu veritabani uzerinde calisan bir REST API + web arayuzu gelistirdim.

## Iki Katman

### 1) Ham SQL (`database/` klasoru)

SQL egitiminde islenen konularin dogrudan T-SQL ile uygulandigi kisim:

- Veritabani ve tablo olusturma (`01_create_database.sql`, `02_create_tables.sql`)
- Primary key, foreign key, unique ve check constraint kullanimi
- `INSERT`, `UPDATE`, `DELETE` islemleri (`03_insert_sample_data.sql`)
- `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY` sorgulari
- `INNER JOIN` ve `LEFT JOIN` kullanimi
- Toplam satis, stok ve musteri siparis raporlari
- View (`vw_ProductSales`) ve stored procedure (`sp_GetCustomerOrders`) ornekleri

Calistirmak icin (SQL Server Management Studio veya `sqlcmd` ile), dosyalari sirasiyla calistirmak yeterli:

```
sqlcmd -S localhost\SQLEXPRESS -E -i database/01_create_database.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/02_create_tables.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/03_insert_sample_data.sql
sqlcmd -S localhost\SQLEXPRESS -E -i database/04_queries.sql
```

### 2) ASP.NET Core Web API (`src/MiniShop.Api`)

Ayni veri modelinin Entity Framework Core ile kod uzerinden yonetildigi, gercek bir REST API katmani:

- Categories, Products, Customers, Orders icin CRUD uc noktalari
- Siparis olusturma sirasinda otomatik stok kontrolu ve toplam tutar hesaplama
- EF Core Migrations ile veritabani semasinin kod uzerinden yonetimi
- Swagger UI ile interaktif API dokumantasyonu ve test

Calistirmak icin:

```
dotnet run --project src/MiniShop.Api
```

sonra tarayicidan `https://localhost:7154/swagger` adresine gidilebilir. Baglanti dizesi `src/MiniShop.Api/appsettings.json` icinde tanimli (varsayilan: `localhost\SQLEXPRESS`).

### 3) React Web Arayuzu (`src/MiniShop.Web`)

Musterinin ve kafe sahibinin kullanacagi, Material UI ile hazirlanmis web arayuzu:

- Urunler: listeleme, yeni urun ekleme, silme
- Kategoriler: listeleme, yeni kategori ekleme
- Siparisler: listeleme, musteri secip urun ekleyerek yeni siparis olusturma

Calistirmak icin (backend zaten calisir durumda olmali):

```
cd src/MiniShop.Web
npm install
npm run dev
```

sonra tarayicidan `http://localhost:5173` adresine gidilebilir.

## Klasor Yapisi

```text
MiniShop/
|-- database/
|   |-- 01_create_database.sql
|   |-- 02_create_tables.sql
|   |-- 03_insert_sample_data.sql
|   `-- 04_queries.sql
|-- diagrams/
|   `-- database-diagram.md
|-- src/
|   |-- MiniShop.Api/      (ASP.NET Core Web API + EF Core)
|   `-- MiniShop.Web/      (React + Material UI arayuzu)
`-- README.md
```

## Durum

Veritabani semasi, ornek veriler ve API'nin CRUD/is kurallari tamamlandi ve test edildi.

## Gelistiren

Ayse Mandirali - [GitHub](https://github.com/aysemandirali)
