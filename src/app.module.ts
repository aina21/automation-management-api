import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentModule } from './environment/environment.module';
import { AutomationModule } from './automation/automation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    //connect to docker mongodb
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
      },
    }),
    // connect to mongodb atlas
    // MongooseModule.forRootAsync({
    //   useFactory: (): MongooseModuleOptions => ({
    //     uri: `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER_URI}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`,
    //     retryAttempts: 6,
    //     retryDelay: 1000,
    //   }),
    // }),
    EnvironmentModule,
    AutomationModule,
  ],
})
export class AppModule {}
