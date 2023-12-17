import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class FindUserDto extends PartialType(PaginationDto) {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName?: string;
}