import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsNumber, IsOptional,
  IsString
} from "class-validator";
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'Джонни',
    description: 'Username пользователя',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Username не должен быть пустым!' })
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    type: String,
    example: 'silverhand@cyber.punk',
    description: 'Почта пользователя',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Почта не должна быть пустым!' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    type: String,
    example: '123123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не должен быть пустым!' })
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiProperty({
    type: String,
    example: 'Джонни',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'Кейдж',
    description: 'Фамилия пользователя',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    type: String,
    example: 'Ильдарович',
    description: 'Отчество пользователя',
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Возраст пользователя',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({
    type: String,
    example: '89999999999',
    description: 'Номер пользователя',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
