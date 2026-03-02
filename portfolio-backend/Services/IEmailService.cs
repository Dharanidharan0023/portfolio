namespace portfolio_backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendContactNotificationAsync(string fromName, string fromEmail, string subject, string message);
    }
}
