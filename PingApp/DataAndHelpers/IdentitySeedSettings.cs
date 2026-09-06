namespace PingApp.DataAndHelpers;

public class IdentitySeedSettings
{
    public string[] Roles { get; set; } = [];
    public string AdminUserName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
}
