import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(newUser: NewUserDto) {
    const user = this.userRepository.create(newUser);
    const exists = await this.userRepository.exists({
      where: { name: user.name },
    });
    if (exists) {
      throw new ConflictException('User name already exists');
    }
    const createdUser = await this.userRepository.save(user);
    return plainToInstance(NewUserResponseDto, instanceToPlain(createdUser));
  }

  async getAll(page: number) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const [result, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      data: result.map((r) => {
        const response = new NewUserResponseDto();
        return Object.assign(response, r);
      }),
      pages: Math.ceil(total / limit),
      page: page,
    };
  }

  async findById(id: number): Promise<NewUserResponseDto | undefined> {
    const found = await this.userRepository.find({
      where: {
        id,
      },
      take: 1,
    });

    if (found.length === 0) {
      return;
    }

    return Object.assign(new NewUserResponseDto(), found[0]);
  }
}
