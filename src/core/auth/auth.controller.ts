import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Me } from '../decorators/user.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../common/interfaces/auth-user';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtMAilAuthGuard } from './guards/jwt-mail-auth.guard';
import { hash } from 'bcrypt';
import { CreatePasswordDto } from './dto/create-password.dto';
import { MailService } from '../common/services/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

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
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@Me() user: AuthUser) {
    return this.authService.refreshToken(user.id);
  }

  @Post('create-password')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      example: {
        password: 'Abc123**',
      },
    },
  })
  @UseGuards(JwtMAilAuthGuard)
  async createPassword(
    @Me() user: AuthUser,
    @Body() createPasswordDto: CreatePasswordDto,
  ) {
    await this.authService.createPassword(user.id, createPasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const user = await this.authService.getUserCredentials(body.email);
    if (user) {
      await this.mailService.sendMail(
        user.email,
        `Seja bem vindo ${user.name}`,
        'Finalize seu cadastro no NeuroBridge',
        await this.mailService.forgotPasswordEmail(user),
      );
    }
  }

  @Post('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePassword(@Me() user: AuthUser, @Body() body: CreatePasswordDto) {
    return this.authService.changePassword(user.id, body.password);
  }
}
