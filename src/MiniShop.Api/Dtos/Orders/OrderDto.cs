using MiniShop.Api.Enums;

namespace MiniShop.Api.Dtos.Orders;

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
}
