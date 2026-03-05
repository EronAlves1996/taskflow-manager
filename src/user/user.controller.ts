import { Body, Controller, Post } from '@nestjs/common';
import { NewUserDto } from './new-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() newUser: NewUserDto) {
    return this.service.create(newUser);
  }
}
