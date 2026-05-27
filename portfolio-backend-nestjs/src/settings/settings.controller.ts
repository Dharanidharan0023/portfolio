import { Controller, Get, Post, Put, Body, Param, UseGuards, NotFoundException, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicSettings() {
    return this.prisma.setting.findMany();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSettings() {
    return this.getPublicSettings();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSetting(@Body() body: any) {
    if (!body.key) {
      throw new BadRequestException('Key is required');
    }
    const existing = await this.prisma.setting.findUnique({
      where: { key: body.key },
    });
    if (existing) {
      throw new BadRequestException('Setting with this key already exists');
    }

    return this.prisma.setting.create({
      data: {
        key: body.key,
        value: body.value,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateSetting(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.setting.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Setting not found');
    }

    return this.prisma.setting.update({
      where: { id },
      data: {
        key: body.key !== undefined ? body.key : existing.key,
        value: body.value !== undefined ? body.value : existing.value,
      },
    });
  }
}
