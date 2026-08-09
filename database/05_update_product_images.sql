-- ============================================
-- MiniShop - Urun Gorsellerini Guncelleme
-- ============================================
-- Her urunun kategorisine gore temali bir gorsel adresi atar.
-- UPDATE ... FROM ... JOIN, CASE ifadesi ve string birlestirme (CONCAT) ornegidir.
-- Gorsel servisi: loremflickr.com (anahtar kelimeye gore gercek fotograf dondurur,
-- lock parametresi sayesinde ayni urun her zaman ayni gorseli gosterir).

USE MiniShopDb;
GO

UPDATE p
SET ImageUrl = CONCAT(
    'https://loremflickr.com/400/300/',
    CASE c.Name
        WHEN N'Kahveler' THEN 'coffee'
        WHEN N'Soğuk İçecekler' THEN 'icedcoffee'
        WHEN N'Tatlılar' THEN 'dessert'
        WHEN N'Atıştırmalıklar' THEN 'snack'
        ELSE 'coffee'
    END,
    '?lock=', CAST(p.Id AS NVARCHAR(10))
)
FROM Products p
INNER JOIN Categories c ON c.Id = p.CategoryId;
GO

SELECT TOP 5 Id, Name, ImageUrl FROM Products ORDER BY Id;
