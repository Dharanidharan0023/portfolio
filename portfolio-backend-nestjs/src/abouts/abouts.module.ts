import { Module } from '@nestjs/common';
import { AboutsController } from './abouts.controller';

@Module({
  controllers: [AboutsController],
})
export class AboutsModule {}
