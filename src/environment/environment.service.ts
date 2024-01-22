import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Environment } from 'src/schemas/environment.schema';
import { EnvironmentDto } from './dto/environment.dto';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectModel(Environment.name)
    private readonly environmentRepository: Model<EnvironmentDto>,
  ) {}

  async createEnvironment(body: Environment): Promise<EnvironmentDto> {
    const createdEnvironment = new this.environmentRepository(body);
    const environment = await createdEnvironment.save();
    return environment;
  }

  async getAllEnvironments(): Promise<EnvironmentDto[]> {
    const environments = await this.environmentRepository.find().exec();
    return environments;
  }

  async getEnvironmentById(environmentId: string): Promise<EnvironmentDto> {
    const objectId = new Types.ObjectId(environmentId);
    const environment = await this.environmentRepository
      .findById(objectId)
      .exec();
    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    return environment;
  }
}
