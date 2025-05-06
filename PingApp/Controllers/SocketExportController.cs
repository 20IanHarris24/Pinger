using Microsoft.AspNetCore.Mvc;
using PingApp.DataAndHelpers;

namespace PingApp.Controllers
{
    public class SocketExport
    {
        public ShipResult ShipResult
        {
            get;
            set;
        }
    }

    [ApiController]
    [Route("[controller]")]
    public class SocketExportController : ControllerBase
    {
        [HttpGet]
        public SocketExport GetSocketExport()
        {
            return new SocketExport();
        }
    }
}