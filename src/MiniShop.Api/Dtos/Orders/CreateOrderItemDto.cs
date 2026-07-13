using System.ComponentModel.DataAnnotations;

namespace MiniShop.Api.Dtos.Orders;

public class CreateOrderItemDto
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; }
}
