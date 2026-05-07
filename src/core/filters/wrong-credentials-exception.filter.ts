import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsExceptionFilter extends HttpException {
  constructor() {
    super('Email ou senha inválidos', HttpStatus.FORBIDDEN);
  }
}

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('CPF ou senha inválidos', HttpStatus.FORBIDDEN);
  }
}
