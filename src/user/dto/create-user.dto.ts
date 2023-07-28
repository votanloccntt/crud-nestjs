import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends UserEntity {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  lat: string;

  @IsNotEmpty()
  lng: string;
}
