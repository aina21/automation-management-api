import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAutomationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly environmentName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  readonly criticalRatio: number;
}

export class AutomationSortDto {
  @ApiProperty({ enum: ['asc', 'desc'], required: false, default: 'asc' })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  readonly sortType?: 'asc' | 'desc';

  @ApiProperty({
    enum: ['name', 'criticalRatio', 'criticality'],
    required: false,
    default: 'criticality',
  })
  @IsString()
  @IsIn(['name', 'criticalRatio', 'criticality'])
  @IsOptional()
  readonly sortName?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  readonly limit?: number;
}

export class AutomationDtoResponse {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly environmentId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  readonly criticalRatio: number;

  @ApiProperty()
  @Min(1)
  readonly criticality: number;
}

export class AutomationDtoResponseOnlyId {
  @ApiProperty()
  readonly id: string;
}

export class AutomationUpdateRequestDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  readonly criticalRatio: number;
}
