-- ============================================
-- MiniShop - Veritabani Olusturma
-- ============================================
-- Bu script MiniShopDb veritabanini olusturur.
-- Zaten varsa tekrar olusturmaya calismaz (IF NOT EXISTS).

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'MiniShopDb')
BEGIN
    CREATE DATABASE MiniShopDb;
END
GO
