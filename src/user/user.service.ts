import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { NewUserDto } from './new-user.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { NewUserResponseDto } from './new-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(newUser: NewUserDto) {
    const createdUser = this.userRepository.create(
      plainToInstance(User, instanceToPlain(newUser)),
    );

    return plainToInstance(NewUserResponseDto, instanceToPlain(createdUser));
  }
}
