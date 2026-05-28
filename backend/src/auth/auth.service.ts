// Elysian — Auth Service

import {
  Injectable,
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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
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
    let user = await this.userRepo.findOne({
      where: { google_id: profile.google_id },
    });

    if (!user) {
      // Check if user exists with same email
      user = await this.userRepo.findOne({
        where: { email: profile.email },
      });
      if (user) {
        // Link Google to existing account
        user.google_id = profile.google_id;
        if (!user.avatar_url) user.avatar_url = profile.avatar_url;
        if (!user.name) user.name = profile.name;
        await this.userRepo.save(user);
      } else {
        // Create new user
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
