import { Controller, Get, Post, Body, Ip, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/activitylogs')
@UseGuards(JwtAuthGuard)
export class ActivityLogsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getActivityLogs() {
    return this.prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  @Post()
  async createActivityLog(@Body() body: any, @Ip() ipAddress: string) {
    return this.prisma.activityLog.create({
      data: {
        action: body.action,
        entity: body.entity,
        entityId: body.entityId ? parseInt(body.entityId, 10) : null,
        userId: body.userId ? parseInt(body.userId, 10) : null,
        ipAddress: ipAddress,
        timestamp: new Date(),
      },
    });
  }
}
