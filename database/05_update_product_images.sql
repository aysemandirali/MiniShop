-- ============================================
-- MiniShop - Urun Gorsellerini Guncelleme
-- ============================================
-- Her urune, kategorisine uygun GERCEK bir fotograf atar (Wikimedia Commons'tan,
-- serbest lisansli ve stabil adresli gorseller). Yonlendirme (redirect) gecikmesini
-- onlemek icin dogrudan upload.wikimedia.org adresleri kullanilir. Ayni kategorideki
-- urunler, o kategori icin dogrulanmis birden fazla fotograf arasinda ROW_NUMBER ile
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
    WHEN N'Kahveler' THEN
        CASE r.Sira % 3
            WHEN 0 THEN 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Espresso.jpg'
            WHEN 1 THEN 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cappuccino.jpg'
            ELSE 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Turkish_coffee.jpg'
        END
    WHEN N'Soğuk İçecekler' THEN
        CASE r.Sira % 6
            WHEN 0 THEN 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Iced_tea.jpg'
            WHEN 1 THEN 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Ayran.jpg'
            WHEN 2 THEN 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Lemonade.jpg'
            WHEN 3 THEN 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Orange_juice.jpg'
            WHEN 4 THEN 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Milkshake.jpg'
            ELSE 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Iced_coffee.jpg'
        END
    WHEN N'Tatlılar' THEN 'https://upload.wikimedia.org/wikipedia/commons/8/87/Tiramisu.jpg'
    WHEN N'Atıştırmalıklar' THEN
        CASE r.Sira % 2
            WHEN 0 THEN 'https://upload.wikimedia.org/wikipedia/commons/3/32/Croissant.jpg'
            ELSE 'https://upload.wikimedia.org/wikipedia/commons/5/57/Mixed_nuts.jpg'
        END
    ELSE 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Espresso.jpg'
END
FROM Products p
INNER JOIN Ranked r ON r.Id = p.Id;
GO

SELECT Id, Name, ImageUrl FROM Products ORDER BY CategoryId, Id;
