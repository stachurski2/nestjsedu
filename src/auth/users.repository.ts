import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredientialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredientialsDto;
    try {
      const user = await this.create({
        username: username,
        password: password,
      });
      await this.save(user);
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
