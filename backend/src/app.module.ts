// Elysian — Root Module

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { HealthModule } from './health/health.module';
import { InsightsModule } from './insights/insights.module';
import { ProfileModule } from './profile/profile.module';
import { SeedModule } from './seed/seed.module';
import { WorkoutsModule } from './workouts/workouts.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // Never auto-sync in production — use Supabase migrations
        ssl: config.get<string>('DATABASE_URL')?.includes('supabase.co')
          ? { rejectUnauthorized: false }
          : false,
        logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
      }),
    }),

    // Feature modules
    AuthModule,
    HealthModule,
    WorkoutsModule,
    InsightsModule,
    ChatModule,
    ProfileModule,
    SeedModule,
  ],
})
export class AppModule {}
