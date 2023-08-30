import { Injectable } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
