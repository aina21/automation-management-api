import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type EnvironmentDocument = HydratedDocument<Environment>;

@Schema()
export class Environment {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String })
  description: string;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
