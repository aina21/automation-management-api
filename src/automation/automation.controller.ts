import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Automation } from 'src/schemas/automation.schema';
import { DeleteAutomationDto } from 'src/automation/dto/automation.dto';
import { ObjectId } from 'mongodb';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new automation',
    description: 'Create new automation',
  })
  @ApiResponse({ status: 201, type: Automation })
  async createAutomation(
    @Body() automationBody: Automation,
  ): Promise<Automation> {
    return this.automationService.create(automationBody);
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a automation',
    description: 'Delete a specific automation by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiResponse({ status: 200, type: DeleteAutomationDto })
  async deleteAutomation(
    @Param('id') id: ObjectId,
  ): Promise<DeleteAutomationDto> {
    return this.automationService.delete(id);
  }

  @Patch(':id/critical-ratio')
  @ApiOperation({
    summary: 'Update automation critical ratio',
    description: 'Update automation critical ratio by id',
  })
  @ApiParam({
    name: 'id',
    type: ObjectId,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiResponse({ status: 200, type: Automation })
  async updateAutomationCriticalRatio(
    @Param('id') id: ObjectId,
    @Body('criticalRatio') criticalRatio: number,
  ) {
    return this.automationService.update(id, criticalRatio);
  }

  @Get()
  @ApiOperation({
    summary: 'Get automations',
    description: 'Get all existing automations',
  })
  @ApiResponse({ status: 200, type: [Automation] })
  async getAllAutomation(
    @Query('sortType') sortType: 'asc' | 'desc',
    @Query('sortName') sortName: string,
  ) {
    return this.automationService.findAll(sortType, sortName);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Filter automations',
    description: 'Filter automations by environment id',
  })
  @ApiQuery({ name: 'environmentId', type: String })
  @ApiResponse({ status: 200, type: [Automation] })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  async getAutomationByEnvironmentId(
    @Query('environmentId') environmentId: string,
  ) {
    return this.automationService.findByEnvironmentId(environmentId);
  }
}
