// PulseAI — Profile Service

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthUser } from '../auth/jwt.strategy';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async findOrCreate(user: AuthUser): Promise<Profile> {
    let profile = await this.profileRepo.findOne({
      where: { id: user.id },
    });

    if (!profile) {
      // Auto-create profile for new users
      profile = this.profileRepo.create({
        id: user.id,
        display_name: user.email?.split('@')[0] || 'User',
        avatar_url: null,
      });
      profile = await this.profileRepo.save(profile);
      this.logger.log(`Created new profile for user ${user.id}`);
    }

    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    await this.profileRepo.update(userId, {
      ...dto,
      updated_at: new Date(),
    });

    const updated = await this.profileRepo.findOne({
      where: { id: userId },
    });

    return updated!;
  }
}
