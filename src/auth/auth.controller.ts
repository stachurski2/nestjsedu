import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('AuthController');

  @Post('/signup')
  @ApiResponse({ status: 201 })
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(
      `signup with credientials ${JSON.stringify(authCredentialsDto)}`,
    );
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @ApiOkResponse({
    schema: {
      type: 'object',
      example: {
        accessToken: 'string',
      },
    },
  })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(
      `signup with credientials ${JSON.stringify(authCredentialsDto)}`,
    );
    return this.authService.signIn(authCredentialsDto);
  }
}
