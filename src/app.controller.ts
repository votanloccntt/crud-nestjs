import { Controller, Get } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Controller()
export class AppController {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Get()
  async getHello() {
    const redisData = await this.redis.get('conversation');
    const result = JSON.parse(redisData);

    return { result };
  }
}
