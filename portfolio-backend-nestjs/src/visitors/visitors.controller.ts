import { Controller, Get, Post, Req, Ip, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/visitors')
export class VisitorsController {
  constructor(private prisma: PrismaService) {}

  @Post('track')
  async trackVisit(@Req() req: any, @Ip() ipAddress: string) {
    try {
      const userAgent = req.headers['user-agent'] || '';
      const clientIp = ipAddress || 'unknown';

      // Check if visited in last 24h
      const lastVisit = await this.prisma.visitor.findFirst({
        where: { ipAddress: clientIp },
        orderBy: { timestamp: 'desc' },
      });

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      if (!lastVisit || lastVisit.timestamp < twentyFourHoursAgo) {
        await this.prisma.visitor.create({
          data: {
            ipAddress: clientIp,
            userAgent: userAgent.length > 100 ? userAgent.substring(0, 100) : userAgent,
            timestamp: new Date(),
          },
        });
        return { message: 'Visit tracked successfully' };
      }

      return { message: 'Visit already recorded recently' };
    } catch (ex: any) {
      throw new BadRequestException({ error: ex.message });
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const totalVisitors = await this.prisma.visitor.count();

      // Today visitors (since midnight UTC or midnight local? EF Core uses DateTime.UtcNow.Date which is midnight UTC)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const todayVisitors = await this.prisma.visitor.count({
        where: {
          timestamp: {
            gte: today,
          },
        },
      });

      return {
        totalVisitors,
        todayVisitors,
      };
    } catch (ex: any) {
      throw new BadRequestException({ error: ex.message });
    }
  }
}
