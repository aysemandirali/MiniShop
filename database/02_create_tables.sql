-- ============================================
-- MiniShop - Tablo Olusturma
-- ============================================
-- Categories, Products, Customers, Orders, OrderItems tablolari.
-- Primary key, foreign key, unique ve check constraint kullanimlarini icerir.

USE MiniShopDb;
GO

-- --------------------------------------------
-- Categories
-- --------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(100)  NOT NULL,
        Description  NVARCHAR(500)  NULL,
        ImageUrl     NVARCHAR(500)  NULL,
        IsActive     BIT            NOT NULL DEFAULT 1,
        CreatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Categories_Name UNIQUE (Name)
    );
END
GO

-- --------------------------------------------
-- Products
-- --------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Name         NVARCHAR(150)   NOT NULL,
        Description  NVARCHAR(1000)  NULL,
        Price        DECIMAL(18,2)   NOT NULL,
        Stock        INT             NOT NULL,
        ImageUrl     NVARCHAR(500)   NULL,
        IsActive     BIT             NOT NULL DEFAULT 1,
        CreatedAt    DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt    DATETIME2       NULL,
        CategoryId   INT             NOT NULL,
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId)
            REFERENCES Categories(Id),
        CONSTRAINT CK_Products_Price CHECK (Price > 0),
        CONSTRAINT CK_Products_Stock CHECK (Stock >= 0)
    );
END
GO

-- --------------------------------------------
-- Customers
-- --------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        FullName     NVARCHAR(150)  NOT NULL,
        Email        NVARCHAR(200)  NOT NULL,
        Phone        NVARCHAR(20)   NULL,
        CreatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Customers_Email UNIQUE (Email)
    );
END
GO

-- --------------------------------------------
-- Orders
-- --------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE Orders (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        OrderNumber  NVARCHAR(30)    NOT NULL,
        OrderDate    DATETIME2       NOT NULL DEFAULT SYSUTCDATETIME(),
        Status       INT             NOT NULL DEFAULT 1,
        TotalAmount  DECIMAL(18,2)   NOT NULL DEFAULT 0,
        CustomerId   INT             NOT NULL,
        CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerId)
            REFERENCES Customers(Id),
        CONSTRAINT UQ_Orders_OrderNumber UNIQUE (OrderNumber),
        -- Status: 1=Pending, 2=Confirmed, 3=Shipped, 4=Delivered, 5=Cancelled
        CONSTRAINT CK_Orders_Status CHECK (Status BETWEEN 1 AND 5)
    );
END
GO

-- --------------------------------------------
-- OrderItems
-- --------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE OrderItems (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        OrderId      INT             NOT NULL,
        ProductId    INT             NOT NULL,
        Quantity     INT             NOT NULL,
        UnitPrice    DECIMAL(18,2)   NOT NULL,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId)
            REFERENCES Orders(Id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId)
            REFERENCES Products(Id),
        CONSTRAINT UQ_OrderItems_Order_Product UNIQUE (OrderId, ProductId),
        CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0),
        CONSTRAINT CK_OrderItems_UnitPrice CHECK (UnitPrice >= 0)
    );
END
GO
