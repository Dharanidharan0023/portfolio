import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, NotFoundException, BadRequestException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/skills')
export class SkillsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicSkills() {
    return this.prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSkills() {
    return this.getPublicSkills();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSkill(@Param('id', ParseIntPipe) id: number) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
    return skill;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSkill(@Body() body: any) {
    let order = body.order || 0;
    if (order === 0) {
      const maxSkill = await this.prisma.skill.findFirst({
        orderBy: { order: 'desc' },
      });
      order = maxSkill ? maxSkill.order + 1 : 1;
    }

    return this.prisma.skill.create({
      data: {
        name: body.name,
        category: body.category || 'General',
        proficiencyLevel: body.proficiencyLevel || 0,
        iconUrl: body.iconUrl,
        order: order,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateSkill(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Skill not found');
    }

    return this.prisma.skill.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category || 'General',
        proficiencyLevel: body.proficiencyLevel !== undefined ? body.proficiencyLevel : existing.proficiencyLevel,
        iconUrl: body.iconUrl,
        order: body.order !== undefined ? body.order : existing.order,
        isVisible: body.isVisible !== undefined ? body.isVisible : existing.isVisible,
      },
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Skill not found');
    }

    await this.prisma.skill.delete({
      where: { id },
    });
  }
}
