import { Controller, Get, Post, Body } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnvironmentDto, EnvironmentRequestDto } from './dto/environment.dto';

@Controller('environment')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new environment',
    description: 'Create new environment',
  })
  @ApiResponse({ status: 201, type: EnvironmentDto })
  async createEnvironment(
    @Body() request: EnvironmentRequestDto,
  ): Promise<EnvironmentDto> {
    return this.environmentService.createEnvironment(request);
  }

  @Get()
  @ApiOperation({
    summary: 'Get environments',
    description: 'Get all existing environments',
  })
  @ApiResponse({ status: 200, type: [EnvironmentDto] })
  async getAllEnvironments(): Promise<EnvironmentDto[]> {
    return this.environmentService.getAllEnvironments();
  }
}
