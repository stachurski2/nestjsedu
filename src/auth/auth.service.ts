import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredientialsDto: AuthCredentialsDto) {
    const user = await this.usersRepository.findOne({
      username: authCredientialsDto.username,
    });
    if (user) {
      throw new ConflictException('user already exits');
    } else {
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(
        authCredientialsDto.password,
        salt,
      );
      authCredientialsDto.password = hashedpassword;
      this.logger.verbose(
        `signup with credientials ${JSON.stringify(authCredientialsDto)}`,
      );
      return this.usersRepository.createUser(authCredientialsDto);
    }
  }

  async signIn(
    authCredientialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(
      `signin with credientials ${JSON.stringify(authCredientialsDto)}`,
    );
    const { username, password } = authCredientialsDto;
    const user = await this.usersRepository.findOne({
      username: authCredientialsDto.username,
    });
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      this.logger.verbose(
        `succedded to signin with credientials ${JSON.stringify(
          authCredientialsDto,
        )}`,
      );
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken: accessToken };
    } else {
      this.logger.verbose(
        `failed to signin with credientials ${JSON.stringify(
          authCredientialsDto,
        )}`,
      );
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
