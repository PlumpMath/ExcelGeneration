using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Diagnostics;
using Microsoft.Office.Interop.Excel;
using System.Text;
using System.Data;
using System.Runtime.InteropServices;
//using Microsoft.Office.Interop.Excel;

namespace WebApplication1
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //string eStr = Request.QueryString["eStr"];
            //if (!Directory.Exists(@"c:\temp"))
            //    Directory.CreateDirectory(@"c:\temp");
            //string path = @"c:\temp\text.xls";            
            //if (!File.Exists(path))
            //{
            //    FileStream fs = File.Create(path);
            //    fs.Dispose();
            //}

            //using (FileStream fs = File.Open(@"c:\temp\text.xls", FileMode.Open, FileAccess.Write))
            //{
            //    //byte[] info = new byte[fs.Length];
            //    //fs.Read(info, 0, info.Length);
            //    eStr = eStr.Replace('|', '\t').Replace(',', '\n');
            //    byte[] info = new UTF8Encoding(true).GetBytes(eStr);
            //    fs.Write(info, 0, info.Length);
            //    Response.ContentType = "application/vnd.ms-excel";
            //    //Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //    Response.AppendHeader("Content-Disposition", "attachment;filename=text.xls");
            //    Response.Clear();
            //    Response.BinaryWrite(info);
            //    //Response.Write("info");
            //    Response.Flush();
            //    Response.Close();
            //}            
        }


        protected void Button1_Click(object sender, EventArgs e)
        {
            Microsoft.Office.Interop.Excel.Application app = new Microsoft.Office.Interop.Excel.Application();
            //Workbook wb = app.Workbooks.Add(XlWBATemplate.xlWBATWorksheet);
            //Worksheet ws = wb.Worksheets[1];
            string path = @"d:\temp\template.xlsx";
            Workbook wb = app.Workbooks.Open(path);
            
            Worksheet ws = wb.Worksheets.get_Item(1);
            //Put export data to datatable
            string eStr = Request.QueryString["eStr"];
            System.Data.DataTable dt = new System.Data.DataTable();

            char[] splitor_row = new char[] { ',' };
            string[] rows = eStr.Split(splitor_row);
            char[] splitor_col = new char[] { '|' };
            string[] columns = rows[0].Split(splitor_col);
            for (int i = 0; i < columns.Count(); i++)
            {
                dt.Columns.Add("Column" + i.ToString(), typeof(string));
            }
            for (int i = 1; i <= rows.Count(); i++)
            {
                DataRow dr = dt.NewRow();                
                int k = 0;
                columns = rows[i - 1].Split(splitor_col);
                for (int j = 1; j <= columns.Count(); j++)
                {
                    dr[k] = columns[j - 1];
                    ws.Cells[i+1, j] = dr[k];
                    k++;
                }
                //Range range = ws.get_Range("A" + i.ToString(), "C" + i.ToString());
                //range.Value2 = dr.ItemArray;
                dt.Rows.Add(dr);
            }
            
            //wb.Save();
            //string tempFilePath = Path.Combine(Path.GetTempPath(), "text.xlsx");
            //Save to temp file
            if (!Directory.Exists(@"d:\temp"))
                Directory.CreateDirectory(@"d:\temp");
            string tempFilePath = @"d:\temp\Export.csv";
            wb.SaveCopyAs(tempFilePath);
            //wb.Save();
            wb.Close(false, Type.Missing, Type.Missing);
            app.Quit();
            //Release com object
            Marshal.FinalReleaseComObject(ws);
            Marshal.FinalReleaseComObject(wb);
            Marshal.FinalReleaseComObject(app);
            //GC.Collect();
            byte[] info = File.ReadAllBytes(tempFilePath);
            File.Delete(tempFilePath);
            //Create response stream
            Response.Clear();
            Response.ContentType = "application/vnd.ms-excel";
            //Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            Response.AppendHeader("Content-Disposition", "attachment;filename=Export.csv");
            Response.BinaryWrite(info);
            Response.Flush();
            Response.Close();
            Response.End();
        }
    }
}