using System.ComponentModel.DataAnnotations;

namespace MiniShop.Api.Dtos.Orders;

public class CreateOrderDto
{
    [Range(1, int.MaxValue)]
    public int CustomerId { get; set; }

    [Required]
    [MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}
