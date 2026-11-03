import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PingerProcessor } from './pinger.processor.js';
import { PingerScheduler } from './pinger.scheduler.js';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pinger-queue',
    }),
  ],
  providers: [PingerProcessor, PingerScheduler],
})
export class PingerModule {}
