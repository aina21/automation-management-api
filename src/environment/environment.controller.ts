import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Environment } from 'src/schemas/environment.schema';
import { EnvironmentDto } from './dto/environment.dto';

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
    @Body() request: EnvironmentDto,
  ): Promise<Environment> {
    const environment =
      await this.environmentService.createEnvironment(request);
    return environment;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a environment',
    description: 'Get a specific environment by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiResponse({ status: 200, type: EnvironmentDto })
  async getEnvironmentById(@Param('id') id: string): Promise<EnvironmentDto> {
    const environment = await this.environmentService.getEnvironmentById(id);
    return environment;
  }

  @Get()
  @ApiOperation({
    summary: 'Get environments',
    description: 'Get all existing environments',
  })
  @ApiResponse({ status: 200, type: [EnvironmentDto] })
  async getAllEnvironments(): Promise<EnvironmentDto[]> {
    const environments = await this.environmentService.getAllEnvironments();
    return environments;
  }
}
