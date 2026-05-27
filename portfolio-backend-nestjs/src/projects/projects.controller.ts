import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicProjects() {
    return this.prisma.project.findMany({
      where: { isVisible: true },
      orderBy: [
        { order: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: [
        { order: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProject(@Param('id', ParseIntPipe) id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxProj = await this.prisma.project.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxProj ? maxProj.order + 1 : 1;
    }

    return this.prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        projectUrl: body.projectUrl,
        githubUrl: body.githubUrl,
        techStack: body.techStack,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProject(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        projectUrl: body.projectUrl,
        githubUrl: body.githubUrl,
        techStack: body.techStack,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
      },
    });
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard)
  async toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: { isVisible: !existing.isVisible },
    });

    return { id: updated.id, isVisible: updated.isVisible };
  }

  @Patch(':id/order')
  @UseGuards(JwtAuthGuard)
  async updateOrder(@Param('id', ParseIntPipe) id: number, @Body('order') order: number) {
    if (order === undefined) {
      // Allow receiving order as raw body if sent directly, else from property 'order'
      throw new BadRequestException('Order value is required');
    }

    const existing = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: { order },
    });

    return { id: updated.id, order: updated.order };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({
      where: { id },
    });
  }
}
