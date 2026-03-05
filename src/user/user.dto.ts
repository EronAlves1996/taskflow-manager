import { NewUserDto } from './new-user.dto';

export class UserDto extends NewUserDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}
