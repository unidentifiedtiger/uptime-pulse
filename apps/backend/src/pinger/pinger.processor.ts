import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DRIZZLE } from '../db/database.module.js';
import { monitorLogs } from '../db/schema.js';

@Processor('pinger-queue')
@Injectable()
export class PingerProcessor extends WorkerHost {
  constructor(@Inject(DRIZZLE) private db: any) {
    super();
  }

  async process(job: Job<{ monitorId: string; url: string; timeout: number }>) {
    const { monitorId, url, timeout } = job.data;
    const startTime = Date.now();

    let isUp = false;
    let statusCode: number | null = null;
    let errorMessage: string | null = null;
    let responseTime = 0;

    try {
      const response = await axios.get(url, {
        timeout,
        validateStatus: () => true, // Принимаем любые статус-коды (даже 404 или 500) как ответ
      });
      responseTime = Date.now() - startTime;
      statusCode = response.status;
      isUp = statusCode >= 200 && statusCode < 400;
    } catch (error: any) {
      responseTime = Date.now() - startTime;
      errorMessage = error.message || 'Unknown error';
      isUp = false;
    }

    // Сохраняем лог проверки в базу данных
    await this.db.insert(monitorLogs).values({
      monitorId,
      statusCode,
      responseTime,
      isUp,
      errorMessage,
    });
  }
}
