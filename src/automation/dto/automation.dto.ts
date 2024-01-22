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

export class CreateAutomationDto {
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
}

export class AutomationDtoResponse extends CreateAutomationDto {
  @ApiProperty()
  @Min(1)
  readonly criticality: number;
}

export class AutomationDtoResponseOnlyId {
  @ApiProperty()
  readonly id: string;
}
