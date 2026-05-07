import { Module } from '@nestjs/common';
import { R2CloudflareService } from './r2-cloudflare.service';
import { R2CloudflareController } from './r2-cloudflare.controller';

@Module({
  controllers: [R2CloudflareController],
  providers: [R2CloudflareService],
  exports: [R2CloudflareService],
})
export class R2CloudflareModule {}
