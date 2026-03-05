import { Length } from 'class-validator';

export class NewUserDto {
  @Length(5, 50)
  name: string;
}
