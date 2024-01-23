import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Environment } from 'src/schemas/environment.schema';
import { EnvironmentDto, EnvironmentRequestDto } from './dto/environment.dto';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectModel(Environment.name)
    private readonly environmentRepository: Model<EnvironmentDto>,
  ) {}

  async createEnvironment(
    body: EnvironmentRequestDto,
  ): Promise<EnvironmentDto> {
    const createdEnvironment = new this.environmentRepository(body);
    return await createdEnvironment.save();
  }

  async getAllEnvironments(): Promise<EnvironmentDto[]> {
    return await this.environmentRepository.find().exec();
  }

  async getEnvironmentByName(environmentName: string): Promise<EnvironmentDto> {
    const environment = await this.environmentRepository
      .findOne({ name: environmentName })
      .exec();

    if (!environment) {
      throw new NotFoundException('Environment not found');
    }
    return environment;
  }
}
