import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,

    @InjectRedis() private readonly redis: Redis,

    private readonly searchService: ElasticsearchService,
  ) {}

  async findAll(request: any): Promise<ConversationEntity[]> {
    const conversation = await this.conversationRepository.find({
      where: { message: { user_id: request.user.id } },
    });
    await this.redis.set('conversation', JSON.stringify(conversation));
    return conversation;
  }

  async createConversation(
    request: any,
    conversation: Partial<CreateConversationDto>,
  ): Promise<ConversationEntity> {
    const newConversation = this.conversationRepository.create({
      ...conversation,
      members: [request.user.id],
    });
    const result = await this.conversationRepository.save(newConversation);
    await this.searchService.index({
      index: 'conversation',
      document: { ...result },
    });
    return result;
  }
}
