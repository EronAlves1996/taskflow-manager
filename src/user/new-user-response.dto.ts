import { NewUserDto } from './new-user.dto';

export class NewUserResponseDto extends NewUserDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}
