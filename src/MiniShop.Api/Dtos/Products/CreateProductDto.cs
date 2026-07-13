using System.ComponentModel.DataAnnotations;

namespace MiniShop.Api.Dtos.Products;

public class CreateProductDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }
}
