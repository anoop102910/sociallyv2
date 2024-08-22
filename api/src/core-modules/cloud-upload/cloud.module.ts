import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloud.service';

@Global()
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
