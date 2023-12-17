import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({
    type: String,
    example: 'example@mail.ru/89999999999',
    description: 'Почта/Телефон пользователя',
    required: true,
  })
  login: string;

  @ApiProperty({
    type: String,
    example: '123123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsString()
  password: string;
}
