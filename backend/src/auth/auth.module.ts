// Elysian — Auth Module

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

const optionalProviders: any[] = [];
if (process.env.GOOGLE_CLIENT_ID) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { GoogleStrategy } = require('./google.strategy');
  optionalProviders.push(GoogleStrategy);
}

const imports: any[] = [
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET') || 'elysian-dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  }),
];

if (process.env.DATABASE_URL) {
  imports.push(TypeOrmModule.forFeature([User]));
}

@Module({
  imports,
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...optionalProviders],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
