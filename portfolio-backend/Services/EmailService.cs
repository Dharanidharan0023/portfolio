using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Logging;

namespace portfolio_backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogError("SendGrid API key is missing. Set the SENDGRID_API_KEY environment variable.");
                throw new InvalidOperationException("SendGrid API key not configured.");
            }

            var senderEmail = _config["SendGridSettings:SenderEmail"] ?? "ksdharanidharan2005@gmail.com";
            var senderName = _config["SendGridSettings:SenderName"] ?? "Portfolio Admin";

            var client = new SendGridClient(apiKey);
            var fromAddress = new EmailAddress(senderEmail, senderName);
            var toAddress = new EmailAddress(to);

            var msg = MailHelper.CreateSingleEmail(fromAddress, toAddress, subject, null, body);

            try
            {
                var response = await client.SendEmailAsync(msg);
                if (!response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Failed to send email via SendGrid. Status: {response.StatusCode}. Body: {responseBody}");
                }
                else
                {
                    _logger.LogInformation($"Email sent successfully to {to} via SendGrid.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending email via SendGrid.");
                throw;
            }
        }

        public async Task SendContactNotificationAsync(string fromName, string fromEmail, string subject, string message)
        {
            // Always send notification to the admin/defined sender email
            var recipient = _config["SendGridSettings:SenderEmail"] ?? "ksdharanidharan2005@gmail.com";
            
            var body = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>
                    <h3 style='color: #333; margin-top: 0;'>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> {fromName}</p>
                    <p><strong>Email:</strong> {fromEmail}</p>
                    <p><strong>Subject:</strong> {subject}</p>
                    <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
                    <p><strong>Message:</strong></p>
                    <p style='white-space: pre-wrap; color: #555;'>{message}</p>
                </div>
            ";

            await SendEmailAsync(recipient, $"[Portfolio Contact] {subject}", body);
        }
    }
}
