import { BadRequestException, ParseIntPipe } from '@nestjs/common';

export function generateParseIntPipe(message: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(message);
    },
  });
}
