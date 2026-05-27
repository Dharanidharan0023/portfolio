import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/educations')
export class EducationsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicEducations() {
    return this.prisma.education.findMany({
      where: { isVisible: true },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getEducations() {
    return this.prisma.education.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEducation(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxEdu = await this.prisma.education.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxEdu ? maxEdu.order + 1 : 1;
    }

    return this.prisma.education.create({
      data: {
        institution: body.institution,
        degree: body.degree,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : new Date(),
        description: body.description,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateEducation(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.education.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Education not found');
    }

    return this.prisma.education.update({
      where: { id },
      data: {
        institution: body.institution,
        degree: body.degree,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existing.endDate,
        description: body.description,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEducation(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.education.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Education not found');
    }

    await this.prisma.education.delete({
      where: { id },
    });
  }
}
