import { Controller, Get, Post, Put, Body, Param, UseGuards, NotFoundException, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async getPublicProfile() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return this.getPublicProfile();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProfile(@Body() body: any) {
    const existing = await this.prisma.profile.findFirst();
    if (existing) {
      throw new BadRequestException('Profile already exists. Use PUT to update.');
    }
    return this.prisma.profile.create({
      data: {
        fullName: body.fullName,
        title: body.title,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
        resumeUrl: body.resumeUrl,
        leadershipTitle: body.leadershipTitle,
        leadershipBio: body.leadershipBio,
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    if (body.id && body.id !== id) {
      throw new BadRequestException('ID mismatch');
    }
    const existing = await this.prisma.profile.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }
    return this.prisma.profile.update({
      where: { id },
      data: {
        fullName: body.fullName,
        title: body.title,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
        resumeUrl: body.resumeUrl,
        leadershipTitle: body.leadershipTitle,
        leadershipBio: body.leadershipBio,
      },
    });
  }
}
