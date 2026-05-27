import { Controller, Get, Post, Put, Body, Param, UseGuards, NotFoundException, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/abouts')
export class AboutsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicAbout() {
    const about = await this.prisma.about.findFirst();
    if (!about) {
      throw new NotFoundException('About section not found');
    }
    return about;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAbout() {
    return this.getPublicAbout();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAbout(@Body() body: any) {
    const existing = await this.prisma.about.findFirst();
    if (existing) {
      throw new BadRequestException('About section already exists');
    }
    return this.prisma.about.create({
      data: {
        description: body.description,
        highlights: body.highlights,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAbout(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.about.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('About section not found');
    }
    return this.prisma.about.update({
      where: { id },
      data: {
        description: body.description,
        highlights: body.highlights,
      },
    });
  }
}
