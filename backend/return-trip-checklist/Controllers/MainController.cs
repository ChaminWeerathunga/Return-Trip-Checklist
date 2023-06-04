using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using System.IO;
using return_trip_checklist.Entities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using System.Reflection.Emit;

namespace return_trip_checklist.Controllers
{
    [ApiController]
    public class MainController : ControllerBase
    {
        private readonly PdfGenerator pdfGenerator;
        private readonly EmailSender emailSender;

        public MainController(PdfGenerator pdfGenerator, EmailSender emailSender)
        {
            this.pdfGenerator = pdfGenerator;
            this.emailSender = emailSender;
        }

        [HttpPost]
        [Route("api/form")]
        public IActionResult HandleFormSubmission([FromBody] main formData)
        {
            Dictionary<string, string> formValues = GetFormValues(formData);

            byte[] pdfBytes = pdfGenerator.GeneratePdf(formValues);

            EmailSender emailSender = new EmailSender();
            emailSender.SendEmail(formData.WoNumber, pdfBytes, formValues);

            return Ok("Form submitted successfully.");
        }

        private Dictionary<string, string> GetFormValues(main formData)
        {
            Dictionary<string, string> formValues = new Dictionary<string, string>();

            formValues.Add("WoNumber", formData.WoNumber);
            formValues.Add("CustomerName", formData.CustomerName);
            formValues.Add("Address", formData.Address);
            formValues.Add("PhoneNumber", formData.PhoneNumber);
            formValues.Add("LastInstallDate", formData.LastInstallDate.Date.ToString("yyyy-MM-dd"));
            formValues.Add("ReasonForReturn", formData.ReasonForReturn);
            formValues.Add("RequireNewProduct", formData.RequireNewProduct.ToString());
            formValues.Add("ItemDescription", formData.ItemDescription);
            formValues.Add("PhotoDefectsComplete", formData.PhotoDefectsComplete.ToString());
            formValues.Add("CustomerSignedOff", formData.CustomerSignedOff.ToString());
            formValues.Add("GivenReturnDate", formData.GivenReturnDate.ToString());
            formValues.Add("ReturnDate", formData.GivenReturnDate ? formData?.ReturnDate?.Date.ToString("yyyy-MM-dd") : "");
            formValues.Add("AdditionalInstructions", formData?.AdditionalInstructions);
            formValues.Add("CompletionNotes", formData?.CompletionNotes);
            formValues.Add("ProductOrderedDate", formData.ProductOrderedDate.Date.ToString("yyyy-MM-dd"));
            formValues.Add("ExpectedArrivalDate", formData.ExpectedArrivalDate.Date.ToString("yyyy-MM-dd"));
            formValues.Add("ArrangedReturnDate", formData.ArrangedReturnDate.Date.ToString("yyyy-MM-dd"));
            formValues.Add("AttachRemakeForm", formData.AttachRemakeForm.ToString());
            formValues.Add("ConfirmedArrivalDate", formData.ConfirmedArrivalDate.ToString());
            formValues.Add("ProductInStock", formData.ProductInStock.ToString());
            formValues.Add("JobCompletedBy", formData.JobCompletedBy);
            formValues.Add("JobCompletedDate", formData.JobCompletedDate.Date.ToString("yyyy-MM-dd"));

            return formValues;
        }
    }

    public class PdfGenerator
    {
        public byte[] GeneratePdf(Dictionary<string, string> formData)
        {
            Document document = new Document();
            MemoryStream memoryStream = new MemoryStream(); 
            BaseColor sectionColor = new BaseColor(0, 92, 186);

            PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);

            document.Open();

            Paragraph title = new Paragraph("Return Trip Checklist");
            title.Alignment = Element.ALIGN_LEFT;
            document.Add(title);

            document.Add(new Paragraph(" "));

            PdfPTable section1Table = CreateSectionTable(new float[] { 1f, 1f });
            AddTableRow(section1Table, "Customer Info", 2, true, sectionColor, BaseColor.WHITE);
            AddTableRow(section1Table, "Wo Number", "Customer Name");
            AddTableRow(section1Table, formData["WoNumber"], formData["CustomerName"]);
            AddTableRow(section1Table, "Address", "Phone Number");
            AddTableRow(section1Table, formData["Address"], formData["PhoneNumber"]);
            AddTableRow(section1Table, "Last Install Date", "Reason For Return");
            AddTableRow(section1Table, formData["LastInstallDate"], formData["ReasonForReturn"]);
            AddTableRow(section1Table, "Require New Product", "Item Description");
            AddTableRow(section1Table, formData["RequireNewProduct"], formData["ItemDescription"]);
            AddTableRow(section1Table, "Customer Signed Off", "Return Date");
            AddTableRow(section1Table, formData["CustomerSignedOff"], formData["ReturnDate"]);
            document.Add(section1Table);

            document.Add(Chunk.NEWLINE);

            PdfPTable section2Table = CreateSectionTable(new float[] { 1f, 1f });
            AddTableRow(section2Table, "Additional Information", 2, true, sectionColor, BaseColor.WHITE);
            AddTableRow(section2Table, "Additional Instructions", "Completion Notes");
            AddTableRow(section2Table, formData["AdditionalInstructions"], formData["CompletionNotes"]);
            document.Add(section2Table);

            document.Add(Chunk.NEWLINE);

            PdfPTable section3Table = CreateSectionTable(new float[] { 1f, 1f });
            AddTableRow(section3Table, "Admin To Complete", 2, true, sectionColor, BaseColor.WHITE);
            AddTableRow(section3Table, "Product Ordered Date", "Expected Arrival Date");
            AddTableRow(section3Table, formData["ProductOrderedDate"], formData["ExpectedArrivalDate"]);
            AddTableRow(section3Table, "Arranged Return Date", "Attach Remake Form");
            AddTableRow(section3Table, formData["ArrangedReturnDate"], formData["AttachRemakeForm"]);
            AddTableRow(section3Table, "Confirmed Arrival Date", "Product In Stock");
            AddTableRow(section3Table, formData["ConfirmedArrivalDate"], formData["ProductInStock"]);
            AddTableRow(section3Table, "Job Completed By", "Job Completed Date");
            AddTableRow(section3Table, formData["JobCompletedBy"], formData["JobCompletedDate"]);
            document.Add(section3Table);

            document.Close();

            byte[] pdfBytes = memoryStream.ToArray();

            return pdfBytes;
        }

        private PdfPTable CreateSectionTable(float[] columnWidths)
        {
            PdfPTable table = new PdfPTable(columnWidths);
            table.WidthPercentage = 100;
            return table;
        }

        private void AddTableRow(PdfPTable table, string label1, string label2)
        {
            PdfPCell label1Cell = new PdfPCell(new Phrase(label1));
            PdfPCell label2Cell = new PdfPCell(new Phrase(label2));

            label1Cell.Border = PdfPCell.NO_BORDER;
            label1Cell.Padding = 5;
            label2Cell.Border = PdfPCell.NO_BORDER;
            label2Cell.Padding = 5;

            int rowCount = table.Rows.Count;
            Font boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12);
            Font regularFont = FontFactory.GetFont(FontFactory.HELVETICA, 12);
            BaseColor rowColor = new BaseColor(245, 245, 245);
            BaseColor backgroundColor = rowCount % 2 == 1 ? rowColor : BaseColor.WHITE;
            label1Cell.BackgroundColor = backgroundColor;
            label1Cell.HorizontalAlignment = Element.ALIGN_LEFT;
            label1Cell.VerticalAlignment = Element.ALIGN_MIDDLE;
            label1Cell.Phrase = rowCount % 2 == 1 ? new Phrase(new Chunk(label1, boldFont)) : new Phrase(new Chunk(label1, regularFont));
            label2Cell.BackgroundColor = backgroundColor;
            label2Cell.HorizontalAlignment = Element.ALIGN_LEFT;
            label2Cell.VerticalAlignment = Element.ALIGN_MIDDLE;
            label2Cell.Phrase = rowCount % 2 == 1 ? new Phrase(new Chunk(label2, boldFont)) : new Phrase(new Chunk(label2, regularFont));

            table.AddCell(label1Cell);
            table.AddCell(label2Cell);
        }

        private void AddTableRow(PdfPTable table, string label, int colspan, bool isHeader, BaseColor backgroundColor, BaseColor textColor)
        {
            PdfPCell cell = new PdfPCell(new Phrase(label));
            cell.Colspan = colspan;

            cell.Border = PdfPCell.NO_BORDER;
            cell.Padding = 5;
            cell.BackgroundColor = backgroundColor;
            cell.HorizontalAlignment = Element.ALIGN_LEFT;
            cell.VerticalAlignment = Element.ALIGN_MIDDLE;
            Font boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12);
            cell.Phrase = new Phrase(new Chunk(label, boldFont));

            if (isHeader)
            {
                Font font = new Font(cell.Phrase.Font);
                font.Color = textColor;
                cell.Phrase.Font = font;
            }

            table.AddCell(cell);
        }
    }

    public class EmailSender
    {
        public void SendEmail(string WoNumber, byte[] pdfBytes, Dictionary<string, string> formValues)
        {
            var smtpClient = new SmtpClient("smtp.office365.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("testdev1995@outlook.com", "Dinupa@1234"),
                EnableSsl = true
            };

            var recipients = "VKhatri@centra.ca, mxu@centra.ca"; // Add multiple recipients here

            var message = new MailMessage("testdev1995@outlook.com", recipients) // Update the recipient email addresses
            {
                Subject = "W/O# " + WoNumber + " - Return Trip Checklist",
                Body = "Thank you for submitting the form. Attached is the PDF.",
                IsBodyHtml = true
            };

            foreach (var entry in formValues)
            {
                message.Body += $"<br/>{entry.Key}: {entry.Value}";
            }

            var attachment = new Attachment(new MemoryStream(pdfBytes), "Return_Trip_Checklist_Dinupa_Weerathunga.pdf", "application/pdf");
            message.Attachments.Add(attachment);

            smtpClient.Send(message);
        }

    }
}
