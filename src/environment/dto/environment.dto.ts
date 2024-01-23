import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class EnvironmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;
}

export class EnvironmentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;
}
