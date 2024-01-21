import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ApiResponse } from '@nestjs/swagger';
import { Environment } from 'src/schemas/environment.schema';

@Controller('environment')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Created', type: Environment })
  async createEnvironment(@Body() request: Environment): Promise<Environment> {
    const environment =
      await this.environmentService.createEnvironment(request);
    return environment;
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Get by id', type: Environment })
  async getEnvironmentById(@Param('id') id: string): Promise<Environment> {
    const environment = await this.environmentService.getEnvironmentById(id);
    return environment;
  }

  @Get()
  @ApiResponse({ status: 201, description: 'Get all', type: Environment })
  async getAllEnvironments(): Promise<Environment[]> {
    const environments = await this.environmentService.getAllEnvironments();
    return environments;
  }
}
