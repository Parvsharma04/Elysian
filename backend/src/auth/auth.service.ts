// Elysian — Auth Service

import {
  Injectable,
  Optional,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwksRsa from 'jwks-rsa';
import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly jwksClient = jwksRsa({
    jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
    cache: true,
    rateLimit: true,
  });

  constructor(
    @Optional()
    @InjectRepository(User)
    private readonly userRepo: Repository<User> | null,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    if (!this.userRepo) {
      throw new ConflictException('Database not configured');
    }
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      email: dto.email,
      password_hash: hash,
      name: dto.name || null,
    });
    const saved = await this.userRepo.save(user);
    return this.buildTokenResponse(saved);
  }

  async login(dto: LoginDto) {
    // Demo account — works without database
    if (dto.email === 'demo@elysian.app' && dto.password === 'demo123') {
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'demo@elysian.app',
        name: 'Demo User',
        avatar_url: null,
      } as User;
      return this.buildTokenResponse(demoUser);
    }

    if (!this.userRepo) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildTokenResponse(user);
  }

  async validateGoogleUser(profile: {
    google_id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
  }) {
    if (!this.userRepo) {
      throw new UnauthorizedException('Database not configured');
    }

    let user = await this.userRepo.findOne({
      where: { google_id: profile.google_id },
    });

    if (!user) {
      user = await this.userRepo.findOne({
        where: { email: profile.email },
      });
      if (user) {
        user.google_id = profile.google_id;
        if (!user.avatar_url) user.avatar_url = profile.avatar_url;
        if (!user.name) user.name = profile.name;
        await this.userRepo.save(user);
      } else {
        user = this.userRepo.create({
          email: profile.email,
          google_id: profile.google_id,
          name: profile.name,
          avatar_url: profile.avatar_url,
        });
        user = await this.userRepo.save(user);
      }
    }

    return this.buildTokenResponse(user);
  }

  async getMe(userId: string) {
    if (userId === '00000000-0000-0000-0000-000000000001') {
      return { id: userId, email: 'demo@elysian.app', name: 'Demo User', avatar_url: null };
    }

    if (!this.userRepo) {
      throw new UnauthorizedException('User not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    };
  }

  async verifyFirebaseToken(idToken: string): Promise<any> {
    try {
      const decoded = this.jwtService.decode(idToken, { complete: true }) as any;
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new UnauthorizedException('Invalid token format');
      }

      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID') || 'elysian-1281b';
      
      return await this.jwtService.verifyAsync(idToken, {
        secret: publicKey,
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
        algorithms: ['RS256'],
      });
    } catch (err) {
      throw new UnauthorizedException(`Firebase token verification failed: ${err.message}`);
    }
  }

  async loginWithFirebase(idToken: string) {
    const payload = await this.verifyFirebaseToken(idToken);
    
    if (!payload.email) {
      throw new UnauthorizedException('Firebase token does not contain a verified email');
    }

    if (!this.userRepo) {
      throw new ConflictException('Database not configured');
    }

    let user = await this.userRepo.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      // Auto-provision user if they don't exist
      user = this.userRepo.create({
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar_url: payload.picture || null,
      });
      user = await this.userRepo.save(user);
    } else {
      // Update name/avatar if they are missing locally but present in Firebase
      let updated = false;
      if (!user.name && payload.name) {
        user.name = payload.name;
        updated = true;
      }
      if (!user.avatar_url && payload.picture) {
        user.avatar_url = payload.picture;
        updated = true;
      }
      if (updated) {
        await this.userRepo.save(user);
      }
    }

    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    };
  }
}
