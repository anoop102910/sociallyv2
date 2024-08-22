import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(private env: ConfigService) {
    super(env.get('REDIS_PORT'));
  }
  
  onModuleInit() {
    this.on('connect', () => {
      this.logger.log(`Conneceted to redis server`);
    });

    this.on('error',()=>{
        this.logger.log('Something went wrong')
    })
  }
}
