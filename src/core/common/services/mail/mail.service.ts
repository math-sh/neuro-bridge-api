import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../../interfaces/auth-user';
import { User } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(
    private readonly configService: ConfigService,
    @Inject('JwtMailService')
    private readonly jwtMail: JwtService,
    @InjectRepository(SystemSetting)
    private readonly systemSettingRepo: Repository<SystemSetting>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: `"NeuroBridge" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      Logger.error(error);
    }
  }

  async signEmailToken(user: AuthUser) {
    return await this.jwtMail.signAsync(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        subject: user.id.toString(),
      },
    );
  }

  async newAccountEmail(user: User) {
    const token = await this.signEmailToken({
      id: user.id,
      email: user.email,
      name: user.name,
      profileId: user.profileId,
      supplierId: user.supplierId || null,
      healthUnitId: user.healthUnitId || null,
      profile: { name: user?.profile?.name },
      permissions: user.userpermissions?.map((p) => p.permissionId as number),
    });
    const logoHtml = await this.getLogoHtml();
    const link = `${process.env.FRONTEND_URL}/resetar-senha?token=${token}`;
    return this.buildEmailHtml(
      'Finalize seu cadastro',
      logoHtml,
      `<h1 style="color:#333333;">Bem-vindo ao Superação!</h1>
       <p style="font-size:16px;line-height:1.5;color:#666666;">Olá, <strong>${user.name}</strong></p>
       <p style="font-size:16px;line-height:1.5;color:#666666;">Sua conta foi criada com sucesso. Para definir sua senha e acessar o sistema, clique no botão abaixo:</p>
       <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#86A387;color:#ffffff;text-decoration:none;border-radius:4px;margin-top:20px;">Criar Minha Senha</a>`,
    );
  }

  async forgotPasswordEmail(user: User) {
    const token = await this.signEmailToken({
      id: user.id,
      email: user.email,
      name: user.name,
      profileId: user.profileId,
      supplierId: user.supplierId || null,
      healthUnitId: user.healthUnitId || null,
      profile: { name: user?.profile?.name },
      permissions: user.userpermissions?.map((p) => p.permissionId as number),
    });
    const logoHtml = await this.getLogoHtml();
    const link = `${FRONTEND_URL}/resetar-senha?token=${token}`;
    return this.buildEmailHtml(
      'Recuperação de Senha',
      logoHtml,
      `<h1 style="color:#333333;">Recuperação de Senha</h1>
       <p style="font-size:16px;line-height:1.5;color:#666666;">Olá, <strong>${user.name}</strong></p>
       <p style="font-size:16px;line-height:1.5;color:#666666;">Recebemos uma solicitação para alterar sua senha. Clique no botão abaixo para redefinir:</p>
       <a href="${link}" style="display:inline-block;padding:12px 24px;background-color:#86A387;color:#ffffff;text-decoration:none;border-radius:4px;margin-top:20px;">Redefinir Senha</a>
       <p style="font-size:14px;line-height:1.5;color:#999999;margin-top:20px;">Se você não solicitou esta alteração, ignore este email.</p>`,
    );
  }
}
