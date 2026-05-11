import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../common/interfaces/auth-user';
import { Me } from '../decorators/user.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: 'teste@teste.com',
        password: 'Abc123**',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Me() user: AuthUser) {
    return this.authService.login(user);
  }
}
