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
import {
  AutomationDtoResponse,
  AutomationDtoResponseOnlyId,
  AutomationSortDto,
  CreateAutomationDto,
} from './dto/automation.dto';
import { AutomationResponseOnlyId } from './interface/Automation-response';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new automation',
    description: 'Create new automation',
  })
  @ApiResponse({ status: 201, type: AutomationDtoResponse })
  async createAutomation(
    @Body() createAutomationDto: CreateAutomationDto,
  ): Promise<Automation> {
    return this.automationService.create(createAutomationDto);
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
  @ApiResponse({ status: 200, type: AutomationDtoResponseOnlyId })
  async deleteAutomation(
    @Param('id') id: string,
  ): Promise<AutomationResponseOnlyId> {
    return this.automationService.delete(id);
  }

  @Patch(':id/critical-ratio')
  @ApiOperation({
    summary: 'Update automation critical ratio',
    description: 'Update automation critical ratio by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiResponse({ status: 200, type: AutomationDtoResponse })
  async updateCriticalRatio(
    @Param('id') id: string,
    @Body('criticalRatio') criticalRatio: number,
  ): Promise<Automation> {
    return this.automationService.update(id, criticalRatio);
  }

  @Get()
  @ApiOperation({
    summary: 'Get automations',
    description: 'Get all existing automations',
  })
  @ApiResponse({ status: 200, type: [AutomationDtoResponse] })
  async getAllAutomation(
    @Query() sortQuery?: AutomationSortDto,
  ): Promise<Automation[]> {
    return this.automationService.findAll(sortQuery);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Filter automations',
    description: 'Filter automations by environment id',
  })
  @ApiQuery({ name: 'environmentId', type: String })
  @ApiResponse({ status: 200, type: [AutomationDtoResponse] })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  async getAutomationByFilter(
    @Query('environmentId') environmentId: string,
  ): Promise<Automation[]> {
    return this.automationService.findByEnvironmentId(environmentId);
  }
}
