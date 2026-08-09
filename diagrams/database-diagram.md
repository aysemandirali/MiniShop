# MiniShop Database Diagram

```mermaid
 erDiagram
     CATEGORIES ||--o{ PRODUCTS : "ürünleri içerir"
     CUSTOMERS ||--o{ ORDERS : "sipariş verir"
     ORDERS ||--|{ ORDER_ITEMS : "kalemleri içerir"
     PRODUCTS ||--o{ ORDER_ITEMS : "siparişlerde bulunur"

     CATEGORIES {
         int Id PK
         nvarchar Name UK "max 100"
         nvarchar Description "max 500, nullable"
         nvarchar ImageUrl "max 500, nullable"
         bit IsActive
         datetime2 CreatedAt
     }

     PRODUCTS {
         int Id PK
         nvarchar Name "max 150"
         nvarchar Description "max 1000, nullable"
         decimal Price "decimal(18,2), 0'dan büyük"
         int Stock "0 veya daha büyük"
         nvarchar ImageUrl "max 500, nullable"
         bit IsActive
         datetime2 CreatedAt
         datetime2 UpdatedAt "nullable"
         int CategoryId FK
     }

     CUSTOMERS {
         int Id PK
         nvarchar FullName "max 150"
         nvarchar Email UK "max 200"
         nvarchar Phone "max 20, nullable"
         datetime2 CreatedAt
     }

     ORDERS {
         int Id PK
         nvarchar OrderNumber UK "max 30"
         datetime2 OrderDate
         int Status "1 ile 5 arasında"
         decimal TotalAmount "decimal(18,2)"
         int CustomerId FK
     }

     ORDER_ITEMS {
         int Id PK
         int OrderId FK
         int ProductId FK
         int Quantity "0'dan büyük"
         decimal UnitPrice "decimal(18,2), 0 veya daha büyük"
     }
```

## Relationships

- One category can contain zero or many products.
- Every product belongs to one category.
- One customer can place zero or many orders.
- Every order belongs to one customer.
- Every order contains at least one order item.
- Every order item belongs to one order.
- One product can appear in zero or many order items.
- Every order item refers to one product.

## Database Rules

### Unique Constraints

- `Categories.Name`
- `Customers.Email`
- `Orders.OrderNumber`
- `OrderItems(OrderId, ProductId)`

### Check Constraints

- `Products.Price > 0`
- `Products.Stock >= 0`
- `OrderItems.Quantity > 0`
- `OrderItems.UnitPrice >= 0`
- `Orders.Status BETWEEN 1 AND 5`

### Delete Behaviors

- Category to Products: `RESTRICT`
- Customer to Orders: `RESTRICT`
- Product to OrderItems: `RESTRICT`
- Order to OrderItems: `CASCADE`
