import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { NewUserDto } from './new-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() newUser: NewUserDto) {
    return this.service.create(newUser);
  }

  @Get()
  getAll(@Query('page') page: string | null) {
    const defaultPage = page || 1;
    const numericPage = Number(defaultPage);

    if (!Number.isFinite(numericPage)) {
      throw new BadRequestException('Page must be a number');
    }

    if (numericPage <= 0) {
      throw new BadRequestException('Page must be a positive number');
    }

    return this.service.getAll(numericPage);
  }
}
