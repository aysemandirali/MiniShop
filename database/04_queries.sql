-- ============================================
-- MiniShop - Sorgu Ornekleri
-- ============================================
-- SELECT, WHERE, ORDER BY, GROUP BY, JOIN, VIEW ve
-- STORED PROCEDURE kullanimlarini gosteren ornekler.

USE MiniShopDb;
GO

-- --------------------------------------------
-- 1) Temel SELECT / WHERE / ORDER BY
-- --------------------------------------------

-- Aktif ve stokta olan urunler, fiyata gore azalan siralama
SELECT Name, Price, Stock
FROM Products
WHERE IsActive = 1 AND Stock > 0
ORDER BY Price DESC;

-- 100 TL'nin ustundeki urunler
SELECT Name, Price
FROM Products
WHERE Price > 100
ORDER BY Price ASC;

-- --------------------------------------------
-- 2) INNER JOIN - urun + kategori adi
-- --------------------------------------------
SELECT p.Name AS UrunAdi, c.Name AS KategoriAdi, p.Price, p.Stock
FROM Products p
INNER JOIN Categories c ON p.CategoryId = c.Id
ORDER BY c.Name, p.Name;

-- --------------------------------------------
-- 3) LEFT JOIN - hic urunu olmayan kategoriler dahil
-- --------------------------------------------
SELECT c.Name AS KategoriAdi, COUNT(p.Id) AS UrunSayisi
FROM Categories c
LEFT JOIN Products p ON p.CategoryId = c.Id
GROUP BY c.Name
ORDER BY UrunSayisi DESC;

-- --------------------------------------------
-- 4) GROUP BY - kategoriye gore stok toplami
-- --------------------------------------------
SELECT c.Name AS KategoriAdi, SUM(p.Stock) AS ToplamStok
FROM Products p
INNER JOIN Categories c ON p.CategoryId = c.Id
GROUP BY c.Name
ORDER BY ToplamStok DESC;

-- --------------------------------------------
-- 5) Musteri siparis raporu (coklu JOIN)
-- --------------------------------------------
SELECT
    cu.FullName        AS Musteri,
    o.OrderNumber       AS SiparisNo,
    o.OrderDate         AS SiparisTarihi,
    o.TotalAmount       AS ToplamTutar,
    oi.Quantity         AS Adet,
    p.Name              AS UrunAdi
FROM Orders o
INNER JOIN Customers cu ON o.CustomerId = cu.Id
INNER JOIN OrderItems oi ON oi.OrderId = o.Id
INNER JOIN Products p ON p.Id = oi.ProductId
ORDER BY o.OrderDate DESC;

-- --------------------------------------------
-- 6) Toplam satis raporu - musteri basina
-- --------------------------------------------
SELECT
    cu.FullName AS Musteri,
    COUNT(DISTINCT o.Id) AS SiparisSayisi,
    SUM(o.TotalAmount) AS ToplamHarcama
FROM Customers cu
INNER JOIN Orders o ON o.CustomerId = cu.Id
GROUP BY cu.FullName
ORDER BY ToplamHarcama DESC;

-- --------------------------------------------
-- 7) VIEW ornegi - en cok satan urunler
-- --------------------------------------------
IF OBJECT_ID('vw_ProductSales', 'V') IS NOT NULL
    DROP VIEW vw_ProductSales;
GO

CREATE VIEW vw_ProductSales AS
SELECT
    p.Id            AS ProductId,
    p.Name          AS ProductName,
    SUM(oi.Quantity) AS TotalSold,
    SUM(oi.Quantity * oi.UnitPrice) AS TotalRevenue
FROM Products p
INNER JOIN OrderItems oi ON oi.ProductId = p.Id
GROUP BY p.Id, p.Name;
GO

-- Kullanimi:
-- SELECT * FROM vw_ProductSales ORDER BY TotalRevenue DESC;

-- --------------------------------------------
-- 8) STORED PROCEDURE ornegi - musterinin siparis gecmisi
-- --------------------------------------------
IF OBJECT_ID('sp_GetCustomerOrders', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetCustomerOrders;
GO

CREATE PROCEDURE sp_GetCustomerOrders
    @CustomerId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.OrderNumber,
        o.OrderDate,
        o.Status,
        o.TotalAmount
    FROM Orders o
    WHERE o.CustomerId = @CustomerId
    ORDER BY o.OrderDate DESC;
END
GO

-- Kullanimi:
-- EXEC sp_GetCustomerOrders @CustomerId = 1;
