import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type AutomationDocument = HydratedDocument<Automation>;

@Schema()
export class Automation {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: ObjectId,
    ref: 'Environment',
    required: true,
  })
  environmentId: ObjectId;

  @Prop({ type: Number, min: 0, max: 1, required: true })
  criticalRatio: number;

  @Prop({ type: Number })
  criticality: number;
}

export const AutomationSchema = SchemaFactory.createForClass(Automation);
