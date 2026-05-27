import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailService } from '../email/email.service';

@Controller('api/contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  @Get('public')
  async getPublicContacts() {
    return this.prisma.contact.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getContacts() {
    return this.getPublicContacts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getContact(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createContact(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxCont = await this.prisma.contact.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxCont ? maxCont.order + 1 : 1;
    }

    return this.prisma.contact.create({
      data: {
        type: body.type,
        value: body.value,
        label: body.label,
        iconUrl: body.iconUrl,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateContact(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    return this.prisma.contact.update({
      where: { id },
      data: {
        type: body.type,
        value: body.value,
        label: body.label,
        iconUrl: body.iconUrl,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContact(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id },
    });
  }

  // --- Message submission (Public) ---
  @Post('message')
  async sendMessage(@Body() body: any) {
    if (!body.name || !body.email || !body.message) {
      throw new BadRequestException('Name, email, and message are required.');
    }

    try {
      // Save to database
      const msg = await this.prisma.contactMessage.create({
        data: {
          name: body.name,
          email: body.email,
          subject: body.subject || '',
          message: body.message,
          createdAt: new Date(),
          isRead: false,
        },
      });

      // Attempt email notification
      try {
        await this.emailService.sendContactNotification(
          body.name,
          body.email,
          body.subject || 'No Subject',
          body.message,
        );
      } catch (emailEx: any) {
        this.logger.error(`Failed to send email notification: ${emailEx.message}`);
        // Do not fail the endpoint response, as the message is saved in the database
      }

      return { message: 'Message received and stored successfully' };
    } catch (ex: any) {
      this.logger.error(`Failed to process message: ${ex.message}`, ex.stack);
      throw new BadRequestException('Internal server error while processing message');
    }
  }

  // --- Inbox Endpoints (Admin Only) ---
  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async getMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async getMessage(@Param('id', ParseIntPipe) id: number) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (!message.isRead) {
      return this.prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return message;
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
