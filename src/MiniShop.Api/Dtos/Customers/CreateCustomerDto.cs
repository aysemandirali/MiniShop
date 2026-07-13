using System.ComponentModel.DataAnnotations;

namespace MiniShop.Api.Dtos.Customers;

public class CreateCustomerDto
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [MaxLength(20)]
    public string? Phone { get; set; }
}
