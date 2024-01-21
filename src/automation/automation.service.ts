import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Automation } from 'src/schemas/automation.schema';
import { EnvironmentService } from 'src/environment/environment.service';
import {
  DeleteAutomationDto,
  UpdateAutomationDto,
} from 'src/dto/automation.dto';

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
          $sort: {
            criticalRatio: -1,
          }, // Sort by Critical Ratio in descending order
        },
        {
          $group: {
            _id: null,
            automations: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $unwind: {
            path: '$automations',
            includeArrayIndex: 'temp',
          },
        },
        {
          $addFields: {
            'automations.criticality': { $add: [1, '$temp'] }, // Add the 'temp' value to the 'automations' field
          },
        },
        {
          $project: {
            temp: 0, // Exclude the 'temp' field from the output
          },
        },
        {
          $replaceRoot: { newRoot: '$automations' }, // Replace the root document with the calculated automations
        },
      ];
      const automationDocs =
        await this.automationModel.aggregate(aggregationPipeline);
      const bulkWriteOperations = automationDocs.map((automationDoc) => ({
        updateOne: {
          filter: { _id: automationDoc._id },
          update: { criticality: automationDoc.criticality },
        },
      }));
      await this.automationModel.bulkWrite(bulkWriteOperations);
    } catch (error) {
      console.error('Aggregation Error:', error);
      throw error;
    }
  }

  async create(automationCreateRequest: Automation): Promise<Automation> {
    try {
      const environment = await this.environmentService.getEnvironmentById(
        automationCreateRequest.environmentId,
      );
      if (!environment) {
        throw new BadRequestException('Environment not found');
      }

      const createdAutomation = new this.automationModel(
        automationCreateRequest,
      );

      const automation = await createdAutomation.save();

      await this.updateCriticality();

      const result = await this.automationModel.findById(automation).exec();
      return result;
    } catch (error) {
      console.error('Create Error:', error);
      throw new Error('An error occurred during create');
    }
  }

  async findAll(
    sortType: 'asc' | 'desc' = 'asc',
    sortName: string = 'criticality',
  ): Promise<Automation[]> {
    const sortOption = sortType === 'asc' ? 1 : -1;

    const result = await this.automationModel
      .find()
      .sort({ [sortName]: sortOption })
      .exec();
    // return result.map(this.toResponseDto);
    return result;
  }

  async findByEnvironmentId(environmentId: string): Promise<Automation[]> {
    const objectId = new Types.ObjectId(environmentId);
    const result = await this.automationModel
      .find({ environmentId: objectId })
      .exec();
    return result;
  }

  async update(
    id: string,
    criticalRatio: number,
  ): Promise<UpdateAutomationDto> {
    try {
      const objectId = new Types.ObjectId(id);

      const updatedAutomation = await this.automationModel
        .findByIdAndUpdate(objectId, { criticalRatio }, { new: true })
        .exec();

      // Calculate the criticality using aggregation
      await this.updateCriticality();

      const result = await this.automationModel
        .findById(updatedAutomation)
        .exec();
      return {
        id: result._id.toString(),
        criticalRatio: result.criticalRatio,
        message: 'Automation updated',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Update Error:', error);
      throw new Error('An error occurred during update');
    }
  }

  async delete(id: string): Promise<DeleteAutomationDto> {
    const objectId = new Types.ObjectId(id);
    const deletedAutomation = await this.automationModel
      .findByIdAndDelete(objectId)
      .exec();
    if (!deletedAutomation) {
      throw new NotFoundException('Automation not found');
    }

    await this.updateCriticality();
    return {
      id: id,
      message: 'Automation deleted',
      status: HttpStatus.OK,
    };
  }
}
