using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using System.Diagnostics;

namespace WebApplication1
{
    /// <summary>
    /// Summary description for ExcelExport
    /// </summary>
    public class ExcelExport : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string eStr = context.Request.Form["eStr"];
            Debugger.Launch();
            using (FileStream fs = File.Open(@"D:\temp\text.xlsx",FileMode.Open,FileAccess.Read))
            {
                byte[] info = new byte[fs.Length];
                fs.Read(info, 0, info.Length);
                context.Response.ContentType = "application/vnd.ms-excel";
                context.Response.AppendHeader("Content-Disposition","attachment;filename=text.xlsx");
                context.Response.Clear();
                context.Response.BinaryWrite(info);
                context.Response.Flush();
                context.Response.End();

            }

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}