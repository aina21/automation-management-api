import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import {
  AutomationDtoResponse,
  AutomationDtoResponseOnlyId,
  AutomationSortDto,
  CreateAutomationDto,
} from './dto/automation.dto';
import { Automation } from '../schemas/automation.schema';
import { EnvironmentService } from 'src/environment/environment.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AutomationService {
  constructor(
    @InjectModel(Automation.name)
    private readonly automationModel: Model<Automation>,
    private readonly environmentService: EnvironmentService,
  ) {}

  async updateCriticality(
    sortQuery?: AutomationSortDto,
    environmentId?: ObjectId,
  ) {
    const {
      sortType = 'asc',
      sortName = 'criticality',
      page = 1,
      limit = 10,
    } = sortQuery || {};
    const skip = (page - 1) * limit;
    const sortOption = sortType === 'asc' ? 1 : -1;

    const aggregationPipeline: PipelineStage[] = [
      {
        $setWindowFields: {
          // Sorting the documents by criticalRatio in descending order.
          sortBy: { criticalRatio: -1 },
          // Calculating the rank for each document based on its criticalRatio.
          // The rank is stored in the criticality field.
          output: {
            criticality: {
              // The $denseRank operator is used to assign a continuous rank for each distinct criticalRatio.
              // If multiple documents have the same criticalRatio, they receive the same rank.
              // The next rank is always incremented by 1, regardless of the number of documents with the same value.
              $denseRank: {},
            },
          },
        },
      },
      {
        // Sorting documents
        $sort: { [sortName]: sortOption },
      },
      {
        // Skipping documents for pagination
        $skip: skip,
      },
      {
        // Limiting the number of documents for pagination (page size)
        $limit: limit,
      },
    ];

    if (environmentId) {
      aggregationPipeline.push({
        // Filtering the results after pagination
        $match: {
          environmentId: environmentId,
        },
      });
    }

    try {
      return this.automationModel.aggregate(aggregationPipeline).exec();
    } catch (error) {
      console.error('Aggregation Error:', error);
      throw error;
    }
  }

  toDto(
    automation: Automation & {
      _id: Types.ObjectId;
    },
  ): AutomationDtoResponse {
    const automationDtoResponse: AutomationDtoResponse = {
      _id: automation._id.toString(),
      name: automation.name,
      environmentId: automation.environmentId.toString(),
      criticalRatio: automation.criticalRatio,
      criticality: automation.criticality,
    };

    return automationDtoResponse;
  }

  async getEnvironment(environmentName: string) {
    const environment =
      await this.environmentService.getEnvironmentByName(environmentName);
    if (!environment) {
      throw new BadRequestException('Environment not found');
    }
    return environment;
  }

  async create(
    automationCreateRequest: CreateAutomationDto,
  ): Promise<AutomationDtoResponseOnlyId> {
    const createdAutomation = new this.automationModel(automationCreateRequest);

    const environment = await this.getEnvironment(
      automationCreateRequest.environmentName,
    );

    createdAutomation.environmentId = new Types.ObjectId(environment._id);
    const automation = await createdAutomation.save();

    return { id: automation._id.toString() };
  }

  async findAll(
    sortQuery?: AutomationSortDto,
  ): Promise<AutomationDtoResponse[]> {
    return await this.updateCriticality(sortQuery);
  }
  async findByEnvironmentName(
    environmentName: string,
    sortQuery?: AutomationSortDto,
  ): Promise<AutomationDtoResponse[]> {
    const environment = await this.getEnvironment(environmentName);
    return await this.updateCriticality(
      sortQuery,
      new ObjectId(environment._id),
    );
  }

  async update(
    id: string,
    criticalRatio: number,
  ): Promise<AutomationDtoResponseOnlyId> {
    const updatedAutomation = await this.automationModel
      .findByIdAndUpdate(id, { criticalRatio }, { new: true })
      .exec();

    if (!updatedAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return { id: updatedAutomation._id.toString() };
  }

  async delete(id: string): Promise<AutomationDtoResponseOnlyId> {
    const deletedAutomation = await this.automationModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return { id: deletedAutomation._id.toString() };
  }
}
