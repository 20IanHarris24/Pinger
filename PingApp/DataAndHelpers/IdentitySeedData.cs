using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using PingApp.Models.Entities;

namespace PingApp.DataAndHelpers;

public class IdentitySeedData
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var settings = services
            .GetRequiredService<IOptions<IdentitySeedSettings>>()
            .Value;

        foreach (var role in settings.Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(role));

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ",
                        result.Errors.Select(e => e.Description));

                    throw new InvalidOperationException(
                        $"Failed to create role '{role}': {errors}");
                }
            }
        }

        if (string.IsNullOrWhiteSpace(settings.AdminPassword))
        {
            throw new InvalidOperationException(
                "IdentitySeed:AdminPassword has not been configured.");
        }

        var adminUser = await userManager.FindByNameAsync(
            settings.AdminUserName);

        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = settings.AdminUserName,
                Email = settings.AdminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(
                adminUser,
                settings.AdminPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ",
                    result.Errors.Select(e => e.Description));

                throw new InvalidOperationException(
                    $"Failed to create admin user: {errors}");
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}