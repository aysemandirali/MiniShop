using System.ComponentModel.DataAnnotations;
using MiniShop.Api.Enums;

namespace MiniShop.Api.Dtos.Orders;

public class UpdateOrderStatusDto
{
    [EnumDataType(typeof(OrderStatus))]
    public OrderStatus Status { get; set; }
}
