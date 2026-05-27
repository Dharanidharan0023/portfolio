import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    return {
      token,
      expires: expires.toISOString(),
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    };
  }

  async register(dto: LoginDto, registrationSecret?: string) {
    const anyUser = await this.prisma.user.findFirst();
    const configSecret = this.configService.get<string>('JWT_REGISTRATION_SECRET') || 
                         this.configService.get<string>('JWT_KEY') || 
                         'SuperSecretKeyForJwtAuthenticationInPortfolioApp123!@#';

    if (anyUser && registrationSecret !== configSecret) {
      throw new BadRequestException('Registration is closed.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        role: 'Admin',
      },
    });

    return { message: 'User registered successfully' };
  }
}
