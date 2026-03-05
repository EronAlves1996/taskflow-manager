import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { NewUserDto } from './new-user.dto';
import { UserService } from './user.service';
import { getPositiveNumericValue } from 'src/utils';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() newUser: NewUserDto) {
    return this.service.create(newUser);
  }

  @Get()
  getAll(@Query('page') page: string | null) {
    return this.service.getAll(getPositiveNumericValue(page || '1', 'page'));
  }

  @Get('/:id')
  async findById(@Param('id') id: string | null) {
    const found = await this.service.findById(
      getPositiveNumericValue(id, 'id'),
    );

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }
}
