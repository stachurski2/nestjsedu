import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';
@Controller('auth')
export class AuthController { 
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.signIn(authCredentialsDto);
  }
  
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    const user = GetUser();
    console.log(user); 
  }
}
