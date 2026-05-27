import { Module } from '@nestjs/common';
import { EducationsController } from './educations.controller';

@Module({
  controllers: [EducationsController],
})
export class EducationsModule {}
