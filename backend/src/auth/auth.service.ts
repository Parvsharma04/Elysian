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
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Optional()
    @InjectRepository(User)
    private readonly userRepo: Repository<User> | null,
    private readonly jwtService: JwtService,
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
