using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniShop.Api.Data;
using MiniShop.Api.Dtos.Orders;
using MiniShop.Api.Models;

namespace MiniShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly MiniShopDbContext _context;

    public OrdersController(MiniShopDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
    {
        var orders = await OrderQuery()
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await OrderQuery()
            .FirstOrDefaultAsync(order => order.Id == id);

        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderDto dto)
    {
        var customer = await _context.Customers.FindAsync(dto.CustomerId);

        if (customer is null)
        {
            return BadRequest();
        }

        var requestedItems = dto.Items
            .GroupBy(item => item.ProductId)
            .ToDictionary(group => group.Key, group => group.Sum(item => item.Quantity));

        var productIds = requestedItems.Keys.ToList();
        var products = await _context.Products
            .Where(product => productIds.Contains(product.Id) && product.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count ||
            products.Any(product => product.Stock < requestedItems[product.Id]))
        {
            return BadRequest();
        }

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            CustomerId = customer.Id,
            Customer = customer,
            OrderDate = DateTime.UtcNow
        };

        foreach (var product in products)
        {
            var quantity = requestedItems[product.Id];

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = quantity,
                UnitPrice = product.Price
            });

            product.Stock -= quantity;
        }

        order.TotalAmount = order.OrderItems.Sum(item => item.UnitPrice * item.Quantity);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var result = await OrderQuery()
            .FirstAsync(item => item.Id == order.Id);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, result);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order is null)
        {
            return NotFound();
        }

        order.Status = dto.Status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private IQueryable<OrderDto> OrderQuery()
    {
        return _context.Orders
            .AsNoTracking()
            .Select(order => new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Status = order.Status,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                CustomerId = order.CustomerId,
                CustomerName = order.Customer.FullName,
                Items = order.OrderItems.Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    LineTotal = item.UnitPrice * item.Quantity
                }).ToList()
            });
    }
}
