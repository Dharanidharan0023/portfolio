import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AboutsModule } from './abouts/abouts.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { EducationsModule } from './educations/educations.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ContactsModule } from './contacts/contacts.module';
import { SettingsModule } from './settings/settings.module';
import { ActivityLogsModule } from './activitylogs/activitylogs.module';
import { VisitorsModule } from './visitors/visitors.module';

@Module({
  imports: [
    // Load .env file globally (check multiple paths depending on where the process is launched from)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'portfolio-backend-nestjs', '.env'),
        join(process.cwd(), '.env'),
        '.env',
      ],
    }),

    // Serve static files from /uploads directory at /uploads route
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),

    // Core modules
    PrismaModule,
    EmailModule,
    AuthModule,

    // Feature modules
    UploadsModule,
    ProfilesModule,
    AboutsModule,
    ProjectsModule,
    SkillsModule,
    ExperiencesModule,
    EducationsModule,
    AchievementsModule,
    ContactsModule,
    SettingsModule,
    ActivityLogsModule,
    VisitorsModule,
  ],
})
export class AppModule {}
