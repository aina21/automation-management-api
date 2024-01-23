import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Automation, AutomationSchema } from 'src/schemas/automation.schema';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { EnvironmentModule } from 'src/environment/environment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Automation.name, schema: AutomationSchema },
    ]),
    EnvironmentModule,
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
