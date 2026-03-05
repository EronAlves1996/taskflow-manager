import {
  BadRequestException,
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

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() newUser: NewUserDto) {
    return this.service.create(newUser);
  }

  private getNumericValue(value: string | null, paramName: string) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      throw new BadRequestException(`${paramName} must be a number`);
    }

    if (numericValue <= 0) {
      throw new BadRequestException(`${paramName} must be a positive number`);
    }

    return numericValue;
  }

  @Get()
  getAll(@Query('page') page: string | null) {
    return this.service.getAll(this.getNumericValue(page, 'page'));
  }

  @Get('/:id')
  async findById(@Param('id') id: string | null) {
    const found = await this.service.findById(this.getNumericValue(id, 'id'));

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }
}
