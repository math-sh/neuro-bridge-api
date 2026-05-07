import { Controller } from '@nestjs/common';
import { R2CloudflareService } from './r2-cloudflare.service';

@Controller('r2-cloudflare')
export class R2CloudflareController {
  constructor(private readonly r2CloudflareService: R2CloudflareService) {}
}
