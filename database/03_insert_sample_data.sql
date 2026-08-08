-- ============================================
-- MiniShop - Ornek Veri Ekleme
-- ============================================
-- INSERT kullanimini gosterir. Tablolar bossa veri ekler,
-- doluysa tekrar calistirildiginda veriyi cogaltmaz.

USE MiniShopDb;
GO

-- --------------------------------------------
-- Categories
-- --------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Categories)
BEGIN
    INSERT INTO Categories (Name, Description) VALUES
        (N'Kahveler', N'Sicak ve soguk kahve cesitleri'),
        (N'Soguk Icecekler', N'Serinletici soguk icecekler'),
        (N'Tatlilar', N'Kahvenin yaninda sunulan tatlilar'),
        (N'Atistirmaliklar', N'Tatli ve tuzlu atistirmaliklar');
END
GO

-- --------------------------------------------
-- Products
-- --------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Products)
BEGIN
    INSERT INTO Products (Name, Description, Price, Stock, CategoryId) VALUES
        (N'Espresso',   N'Yogun ve aromatik kahve',      90.00, 50, (SELECT Id FROM Categories WHERE Name = N'Kahveler')),
        (N'Latte',      N'Espresso ve sut kopugu',      120.00, 40, (SELECT Id FROM Categories WHERE Name = N'Kahveler')),
        (N'Iced Latte', N'Soguk sut ve espresso',       130.00, 35, (SELECT Id FROM Categories WHERE Name = N'Soguk Icecekler')),
        (N'Cheesecake', N'Kremali cheesecake dilimi',   150.00, 20, (SELECT Id FROM Categories WHERE Name = N'Tatlilar')),
        (N'Cookie',     N'Cikolata parcacikli kurabiye', 60.00, 30, (SELECT Id FROM Categories WHERE Name = N'Atistirmaliklar'));
END
GO

-- --------------------------------------------
-- Customers
-- --------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Customers)
BEGIN
    INSERT INTO Customers (FullName, Email, Phone) VALUES
        (N'Ayse Mandirali', N'ayse@minishop.local', N'0555 000 00 00'),
        (N'Mehmet Yilmaz',  N'mehmet@minishop.local', N'0555 111 11 11');
END
GO

-- --------------------------------------------
-- Orders + OrderItems (ornek bir siparis)
-- --------------------------------------------
IF NOT EXISTS (SELECT 1 FROM Orders)
BEGIN
    DECLARE @CustomerId INT = (SELECT TOP 1 Id FROM Customers ORDER BY Id);
    DECLARE @EspressoId INT = (SELECT Id FROM Products WHERE Name = N'Espresso');
    DECLARE @CookieId   INT = (SELECT Id FROM Products WHERE Name = N'Cookie');
    DECLARE @OrderId    INT;

    INSERT INTO Orders (OrderNumber, Status, CustomerId, TotalAmount)
    VALUES (N'ORD-SAMPLE-0001', 1, @CustomerId, 0);

    SET @OrderId = SCOPE_IDENTITY();

    INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice) VALUES
        (@OrderId, @EspressoId, 2, 90.00),
        (@OrderId, @CookieId, 1, 60.00);

    UPDATE Orders
    SET TotalAmount = (SELECT SUM(Quantity * UnitPrice) FROM OrderItems WHERE OrderId = @OrderId)
    WHERE Id = @OrderId;
END
GO
