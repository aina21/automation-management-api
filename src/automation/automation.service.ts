import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Automation } from 'src/schemas/automation.schema';
import { EnvironmentService } from 'src/environment/environment.service';
import { AutomationSortDto, CreateAutomationDto } from './dto/automation.dto';
import { AutomationResponseOnlyId } from './interface/Automation-response';

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

  async create(
    automationCreateRequest: CreateAutomationDto,
  ): Promise<Automation> {
    const createdAutomation = new this.automationModel(automationCreateRequest);

    const automation = await createdAutomation.save();

    await this.updateCriticality();

    const result = await this.automationModel.findById(automation).exec();
    return result;
  }

  async findAll(sortQuery?: AutomationSortDto): Promise<Automation[]> {
    const { sortType, sortName } = sortQuery || {
      sortType: 'asc',
      sortName: 'criticality',
    };

    const sortOption = sortType === 'asc' ? 1 : -1;

    const result = await this.automationModel
      .find()
      .sort({ [sortName]: sortOption })
      .exec();

    if (!result) {
      throw new NotFoundException('Automation is empty');
    }

    return result;
  }

  async findByEnvironmentId(environmentId: string): Promise<Automation[]> {
    const result = await this.automationModel
      .find({
        environmentId,
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Automation not found');
    }

    return result;
  }

  async update(id: string, criticalRatio: number): Promise<Automation> {
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
    return result;
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
