import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/achievements')
export class AchievementsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicAchievements() {
    return this.prisma.achievement.findMany({
      where: { isVisible: true },
      orderBy: [
        { order: 'asc' },
        { dateAchieved: 'desc' },
      ],
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: [
        { order: 'asc' },
        { dateAchieved: 'desc' },
      ],
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAchievement(@Param('id', ParseIntPipe) id: number) {
    const ach = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!ach) {
      throw new NotFoundException('Achievement not found');
    }
    return ach;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAchievement(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxAch = await this.prisma.achievement.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxAch ? maxAch.order + 1 : 1;
    }

    return this.prisma.achievement.create({
      data: {
        title: body.title,
        description: body.description,
        dateAchieved: body.dateAchieved ? new Date(body.dateAchieved) : new Date(),
        issuer: body.issuer,
        badgeUrl: body.badgeUrl,
        url: body.url,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAchievement(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Achievement not found');
    }

    return this.prisma.achievement.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        dateAchieved: body.dateAchieved ? new Date(body.dateAchieved) : existing.dateAchieved,
        issuer: body.issuer,
        badgeUrl: body.badgeUrl,
        url: body.url,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAchievement(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.achievement.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Achievement not found');
    }

    await this.prisma.achievement.delete({
      where: { id },
    });
  }
}
