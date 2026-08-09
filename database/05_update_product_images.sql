-- ============================================
-- MiniShop - Urun Gorsellerini Guncelleme
-- ============================================
-- Her urune, kategorisine uygun GERCEK bir fotograf atar (Wikimedia Commons'tan,
-- serbest lisansli ve stabil adresli gorseller). Ayni kategorideki urunler,
-- o kategori icin dogrulanmis birden fazla fotograf arasinda ROW_NUMBER ile
-- sirayla dagitilir; boylece hepsi birbirinin ayni olmaz.
-- Ornekler: CTE (WITH), ROW_NUMBER() OVER (PARTITION BY ...), UPDATE ... FROM ... JOIN,
-- CASE ifadesi.

USE MiniShopDb;
GO

WITH Ranked AS (
    SELECT
        p.Id,
        c.Name AS CategoryName,
        (ROW_NUMBER() OVER (PARTITION BY p.CategoryId ORDER BY p.Id) - 1) AS Sira
    FROM Products p
    INNER JOIN Categories c ON c.Id = p.CategoryId
)
UPDATE p
SET ImageUrl = CASE r.CategoryName
    WHEN N'Kahveler' THEN 'https://commons.wikimedia.org/wiki/Special:FilePath/' + (
        CASE r.Sira % 3
            WHEN 0 THEN 'Espresso.jpg'
            WHEN 1 THEN 'Cappuccino.jpg'
            ELSE 'Turkish_coffee.jpg'
        END)
    WHEN N'Soğuk İçecekler' THEN 'https://commons.wikimedia.org/wiki/Special:FilePath/' + (
        CASE r.Sira % 6
            WHEN 0 THEN 'Iced_tea.jpg'
            WHEN 1 THEN 'Ayran.jpg'
            WHEN 2 THEN 'Lemonade.jpg'
            WHEN 3 THEN 'Orange_juice.jpg'
            WHEN 4 THEN 'Milkshake.jpg'
            ELSE 'Iced_coffee.jpg'
        END)
    WHEN N'Tatlılar' THEN 'https://commons.wikimedia.org/wiki/Special:FilePath/Tiramisu.jpg'
    WHEN N'Atıştırmalıklar' THEN 'https://commons.wikimedia.org/wiki/Special:FilePath/' + (
        CASE r.Sira % 2
            WHEN 0 THEN 'Croissant.jpg'
            ELSE 'Mixed_nuts.jpg'
        END)
    ELSE 'https://commons.wikimedia.org/wiki/Special:FilePath/Espresso.jpg'
END
FROM Products p
INNER JOIN Ranked r ON r.Id = p.Id;
GO

SELECT Id, Name, ImageUrl FROM Products ORDER BY CategoryId, Id;
