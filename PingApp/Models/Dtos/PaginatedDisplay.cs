namespace PingApp.Models.Dtos;

public class PaginatedDisplay<T>
{
    public IEnumerable<T> Data { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    public string Sort { get; set; }

    public string Direction { get; set; }

    public PaginatedDisplay(IEnumerable<T> data, int pageNumber, int pageSize, int totalCount, string sort,
        string direction)
    {
        Data = data;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalCount = totalCount;
        Sort = sort;
        Direction = direction;
    }
}