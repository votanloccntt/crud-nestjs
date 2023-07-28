import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtService } from '@nestjs/jwt';
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

    private readonly jwtService: JwtService,
  ) {}

  async findAll(request: Request): Promise<ConversationEntity[]> {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }
    const token = authorizationHeader.split(' ')[1];
    const checkLogin: any = this.jwtService.decode(token);

    if (!checkLogin) {
      throw new UnauthorizedException('incorrect token');
    }

    const conversation = await this.conversationRepository.find({
      where: { message: { user_id: checkLogin.id } },
    });
    await this.redis.set('conversation', JSON.stringify(conversation));
    return conversation;
  }

  async findOneById(id: number): Promise<ConversationEntity> {
    return this.conversationRepository.findOne({ where: { id } });
  }

  async createConversation(
    request: Request,
    conversation: Partial<CreateConversationDto>,
  ): Promise<ConversationEntity> {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }
    const token = authorizationHeader.split(' ')[1];
    const checkLogin: any = this.jwtService.decode(token);

    if (!checkLogin) {
      throw new UnauthorizedException('incorrect token');
    }
    const newConversation = this.conversationRepository.create({
      ...conversation,
      members: [checkLogin.id],
    });
    const result = await this.conversationRepository.save(newConversation);
    await this.searchService.index({
      index: 'conversation',
      document: { ...result },
    });
    return result;
  }
}
