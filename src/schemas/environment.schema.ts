import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EnvironmentDocument = HydratedDocument<Environment>;

@Schema()
export class Environment {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
