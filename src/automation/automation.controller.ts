import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { ApiResponse } from '@nestjs/swagger';
import { Automation } from 'src/schemas/automation.schema';
import { DeleteAutomationDto } from 'src/dto/automation.dto';

@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: Automation })
  async createAutomation(
    @Body() automationBody: Automation,
  ): Promise<Automation> {
    return this.automationService.create(automationBody);
  }

  @Delete(':id')
  async deleteAutomation(
    @Param('id') id: string,
  ): Promise<DeleteAutomationDto> {
    return this.automationService.delete(id);
  }

  @Put(':id/critical-ratio')
  async updateAutomationCriticalRatio(
    @Param('id') id: string,
    @Body('criticalRatio') criticalRatio: number,
  ) {
    return this.automationService.update(id, criticalRatio);
  }

  @Get()
  async getAllAutomation(
    @Query('sortType') sortType: 'asc' | 'desc',
    @Query('sortName') sortName: string,
  ) {
    return this.automationService.findAll(sortType, sortName);
  }

  @Get('filter')
  async getAutomationByEnvironmentId(
    @Query('environmentId') environmentId: string,
  ) {
    return this.automationService.findByEnvironmentId(environmentId);
  }
}
