// Elysian — Integrations Service

import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationProvider } from './integration.entity';
import { ConnectIntegrationDto } from './dto/connect-integration.dto';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    @InjectRepository(Integration)
    private readonly repo: Repository<Integration>,
  ) {}

  async findByUser(userId: string): Promise<Integration[]> {
    return this.repo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async connect(userId: string, dto: ConnectIntegrationDto): Promise<Integration> {
    const existing = await this.repo.findOne({
      where: { user_id: userId, provider: dto.provider },
    });

    if (existing && existing.status === 'connected') {
      throw new ConflictException(`${dto.provider} is already connected`);
    }

    if (existing) {
      existing.status = 'connected';
      existing.metadata = dto.metadata || {};
      existing.last_synced_at = new Date();
      return this.repo.save(existing);
    }

    const integration = this.repo.create({
      user_id: userId,
      provider: dto.provider,
      status: 'connected',
      metadata: dto.metadata || {},
      last_synced_at: new Date(),
    });
    return this.repo.save(integration);
  }

  async disconnect(userId: string, provider: IntegrationProvider): Promise<Integration> {
    const integration = await this.repo.findOne({
      where: { user_id: userId, provider },
    });

    if (!integration) {
      throw new NotFoundException(`No ${provider} integration found`);
    }

    integration.status = 'disconnected';
    return this.repo.save(integration);
  }

  async syncStatus(userId: string, provider: IntegrationProvider): Promise<Integration | null> {
    return this.repo.findOne({
      where: { user_id: userId, provider },
    });
  }

  async updateSyncStatus(
    userId: string,
    provider: IntegrationProvider,
    recordsSynced: number,
  ): Promise<Integration> {
    const integration = await this.repo.findOne({
      where: { user_id: userId, provider, status: 'connected' },
    });

    if (!integration) {
      throw new NotFoundException(`No active ${provider} integration`);
    }

    integration.last_synced_at = new Date();
    integration.records_synced += recordsSynced;
    return this.repo.save(integration);
  }
}
