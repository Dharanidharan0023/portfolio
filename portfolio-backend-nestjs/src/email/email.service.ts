import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey && apiKey !== 'YOUR_SENDGRID_API_KEY_HERE') {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SendGrid API key not configured or set to placeholder.');
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    
    if (!apiKey || apiKey === 'YOUR_SENDGRID_API_KEY_HERE') {
      this.logger.error('SendGrid API key is missing. Set the SENDGRID_API_KEY environment variable.');
      throw new InternalServerErrorException('SendGrid API key not configured.');
    }

    sgMail.setApiKey(apiKey);

    const senderEmail = this.configService.get<string>('SENDGRID_SENDER_EMAIL') || 'ksdharanidharan2005@gmail.com';
    const senderName = this.configService.get<string>('SENDGRID_SENDER_NAME') || 'Portfolio Admin';

    const msg = {
      to,
      from: {
        email: senderEmail,
        name: senderName,
      },
      subject,
      html: body,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${to} via SendGrid.`);
    } catch (error: any) {
      this.logger.error(`Failed to send email via SendGrid. Error: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(JSON.stringify(error.response.body));
      }
      throw new InternalServerErrorException('Failed to send email via SendGrid.');
    }
  }

  async sendContactNotification(fromName: string, fromEmail: string, subject: string, message: string): Promise<void> {
    const recipient = this.configService.get<string>('SENDGRID_SENDER_EMAIL') || 'ksdharanidharan2005@gmail.com';

    const body = `
      <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>
          <h3 style='color: #333; margin-top: 0;'>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${fromName}</p>
          <p><strong>Email:</strong> ${fromEmail}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
          <p><strong>Message:</strong></p>
          <p style='white-space: pre-wrap; color: #555;'>${message}</p>
      </div>
    `;

    await this.sendEmail(recipient, `[Portfolio Contact] ${subject}`, body);
  }
}
