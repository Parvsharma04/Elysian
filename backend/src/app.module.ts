// Elysian — Root Module

import { Module, type DynamicModule, type Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

// These modules require a database connection
const dbDependentModules: Type[] = [];
if (process.env.DATABASE_URL) {
  // Dynamic requires to avoid import-time crashes
  dbDependentModules.push(
    require('./chat/chat.module').ChatModule,
    require('./health/health.module').HealthModule,
    require('./insights/insights.module').InsightsModule,
    require('./profile/profile.module').ProfileModule,
    require('./seed/seed.module').SeedModule,
    require('./workouts/workouts.module').WorkoutsModule,
  );
}

const dbModule: DynamicModule[] = process.env.DATABASE_URL
  ? [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          type: 'postgres' as const,
          url: config.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: config.get<string>('DATABASE_URL')?.includes('neon.tech')
            ? { rejectUnauthorized: false }
            : false,
          logging:
            config.get('NODE_ENV') === 'development'
              ? ['error', 'warn']
              : ['error'],
        }),
      }),
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ...dbModule,
    AuthModule,
    ...dbDependentModules,
  ],
})
export class AppModule {}
