import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activitylogs.controller';

@Module({
  controllers: [ActivityLogsController],
})
export class ActivityLogsModule {}
