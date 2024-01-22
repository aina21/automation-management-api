import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type AutomationDocument = HydratedDocument<Automation>;

@Schema()
export class Automation {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({
    type: String,
    ref: 'Environment',
    required: true,
  })
  environmentId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  @Prop({ type: Number, min: 0, max: 1, required: true })
  criticalRatio: number;

  @Prop({ type: Number })
  criticality: number;
}

export const AutomationSchema = SchemaFactory.createForClass(Automation);
