import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,

    private readonly searchService: ElasticsearchService,

    private readonly jwtService: JwtService,
  ) {}

  async findByConversation(id: number): Promise<MessageEntity[]> {
    const mess = await this.messageRepository.find({
      where: { conversation_id: { id } },
    });
    await this.searchService.index({
      index: 'message',
      document: { ...mess },
    });
    return mess;
  }

  async findOneById(id: number): Promise<MessageEntity | undefined> {
    return this.messageRepository.findOne({ where: { id } });
  }

  async create(
    request: Request,
    message: Partial<CreateMessageDto>,
  ): Promise<MessageEntity> {
    try {
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid token');
      }
      const token = authorizationHeader.split(' ')[1];
      const checkLogin: any = this.jwtService.decode(token);

      if (!checkLogin) {
        throw new UnauthorizedException('incorrect token');
      }
      const newMessage = this.messageRepository.create({
        ...message,
        user_id: checkLogin.id,
      });
      return this.messageRepository.save(newMessage);
    } catch (error) {
      console.error('Error creating message:', error.message);
    }
  }
}
