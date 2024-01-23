import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import {
  AutomationDtoResponse,
  AutomationSortDto,
  CreateAutomationDto,
} from './dto/automation.dto';
import { AutomationResponseOnlyId } from './interface/Automation-response';
import { Automation } from '../schemas/automation.schema';
import { EnvironmentService } from 'src/environment/environment.service';

@Injectable()
export class AutomationService {
  constructor(
    @InjectModel(Automation.name)
    private readonly automationModel: Model<Automation>,
    private readonly environmentService: EnvironmentService,
  ) {}

  async updateCriticality() {
    try {
      const aggregationPipeline: PipelineStage[] = [
        {
          $setWindowFields: {
            // Use $setWindowFields if applicable for your MongoDB version
            sortBy: { criticalRatio: -1 },
            output: {
              criticality: {
                $rank: {},
              },
            },
          },
        },
      ];

      let bulkWriteOperations = [];
      const batchSize = 1000;

      const cursor = this.automationModel
        .aggregate(aggregationPipeline)
        .cursor({ batchSize });

      await cursor.eachAsync(async (doc) => {
        bulkWriteOperations.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { criticality: doc.criticality } },
          },
        });

        if (bulkWriteOperations.length === batchSize) {
          await this.automationModel.bulkWrite(bulkWriteOperations);
          bulkWriteOperations = []; // Reset the batch
        }
      });

      // Process any remaining operations in the last batch
      if (bulkWriteOperations.length > 0) {
        await this.automationModel.bulkWrite(bulkWriteOperations);
      }
    } catch (error) {
      console.error('Aggregation Error:', error);
      throw error;
    }
  }

  convertToAutomationResponseDto(
    automation: Automation & {
      _id: Types.ObjectId;
    },
  ): AutomationDtoResponse {
    const automationResponseDto: AutomationDtoResponse = {
      _id: automation._id.toString(),
      name: automation.name,
      environmentId: automation.environmentId.toString(),
      criticalRatio: automation.criticalRatio,
      criticality: automation.criticality,
    };

    return automationResponseDto;
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

  async create(
    automationCreateRequest: CreateAutomationDto,
  ): Promise<AutomationDtoResponse> {
    const createdAutomation = new this.automationModel(automationCreateRequest);

    const environment = await this.environmentService.getEnvironmentByName(
      automationCreateRequest.environmentName,
    );
    if (!environment) {
      throw new BadRequestException('Environment not found');
    }

    createdAutomation.environmentId = new Types.ObjectId(environment._id);
    const automation = await createdAutomation.save();

    await this.updateCriticality();

    const result = await this.automationModel.findById(automation).exec();

    return this.toDto(result);
  }

  async findAll(
    sortQuery?: AutomationSortDto,
  ): Promise<AutomationDtoResponse[]> {
    const {
      sortType = 'asc',
      sortName = 'criticality',
      page = 1,
      limit = 10,
    } = sortQuery || {};
    const skip = (page - 1) * limit;
    const sortOption = sortType === 'asc' ? 1 : -1;

    const result = await this.automationModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortName]: sortOption })
      .exec();

    if (!result) {
      throw new NotFoundException('Automation is empty');
    }

    return result.map((automation) => this.toDto(automation));
  }

  async findByEnvironmentName(
    environmentName: string,
    sortQuery?: AutomationSortDto,
  ): Promise<AutomationDtoResponse[]> {
    const {
      sortType = 'asc',
      sortName = 'criticality',
      page = 1,
      limit = 10,
    } = sortQuery || {};

    const skip = (page - 1) * limit;
    const sortOption = sortType === 'asc' ? 1 : -1;

    const environment =
      await this.environmentService.getEnvironmentByName(environmentName);
    if (!environment) {
      throw new BadRequestException('Environment not found');
    }

    const result = await this.automationModel
      .find({
        environmentId: environment._id,
      })
      .skip(skip)
      .limit(limit)
      .sort({ [sortName]: sortOption })
      .exec();

    if (!result) {
      throw new NotFoundException('Automation not found');
    }

    return result.map((automation) => this.toDto(automation));
  }

  async update(
    id: string,
    criticalRatio: number,
  ): Promise<AutomationDtoResponse> {
    const updatedAutomation = await this.automationModel
      .findByIdAndUpdate(id, { criticalRatio }, { new: true })
      .exec();

    if (!updatedAutomation) {
      throw new NotFoundException('Automation not found');
    }

    await this.updateCriticality();

    const result = await this.automationModel
      .findById(updatedAutomation)
      .exec();
    return this.toDto(result);
  }

  async delete(id: string): Promise<AutomationResponseOnlyId> {
    const deletedAutomation = await this.automationModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return { id: deletedAutomation._id.toString() };
  }
}
