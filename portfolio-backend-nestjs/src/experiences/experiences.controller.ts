import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/experiences')
export class ExperiencesController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicExperiences() {
    return this.prisma.experience.findMany({
      where: { isVisible: true },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getExperiences() {
    return this.prisma.experience.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExperience(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxExp = await this.prisma.experience.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxExp ? maxExp.order + 1 : 1;
    }

    return this.prisma.experience.create({
      data: {
        company: body.company,
        role: body.role,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent !== undefined ? body.isCurrent : false,
        description: body.description,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateExperience(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Experience not found');
    }

    return this.prisma.experience.update({
      where: { id },
      data: {
        company: body.company,
        role: body.role,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent !== undefined ? body.isCurrent : existing.isCurrent,
        description: body.description,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExperience(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.experience.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Experience not found');
    }

    await this.prisma.experience.delete({
      where: { id },
    });
  }
}
