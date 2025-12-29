using System.ComponentModel.DataAnnotations;

namespace PingApp.DataAndHelpers;


public class PaginationSettings
{
    
    [Range(1, int.MaxValue)]
    public int MaxPageSize { get; init; } = 100;
    
    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;
    
    [Range(1, int.MaxValue)]
    public int PageSize { get; init; } = 12;
    
    
    //public string? Search { get; init; } = null;
    
    
    [Required, MinLength(1)]
    public string Sort { get; set; } = "name";
    
    [Required, MinLength(1)]
    public string Direction { get; set; } = "desc";
    

}
