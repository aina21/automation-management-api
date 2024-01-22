import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Environment } from '../schemas/environment.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectModel(Environment.name)
    private readonly environmentModel: Model<Environment>,
  ) {}

  async createEnvironment(body: Environment): Promise<Environment> {
    const createdEnvironment = new this.environmentModel(body);
    const environment = await createdEnvironment.save();
    return environment;
  }

  async getAllEnvironments(): Promise<Environment[]> {
    const environments = await this.environmentModel.find().exec();
    return environments;
  }

  async getEnvironmentById(environmentId: ObjectId): Promise<Environment> {
    const environment = await this.environmentModel
      .findById(environmentId)
      .exec();
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    return null;
  }
}
