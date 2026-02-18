import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export class CustomParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: value => {
        throw new BadRequestException(`Valor ${value} não é um número inteiro`);
      },
    });
  }
}
