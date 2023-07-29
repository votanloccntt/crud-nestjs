import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { In, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,

    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>,

    private readonly searchService: ElasticsearchService,
  ) {}

  async findByConversation(request: any, id: number): Promise<MessageEntity[]> {
    const check = await this.conversationRepository.findOne({
      where: {
        members: In([request.user.id]),
      },
    });
    if (!check) {
      throw new HttpException(
        'Người dùng không nằm trong cuộc trò chuyện',
        HttpStatus.NOT_FOUND,
      );
    }

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
    request: any,
    message: Partial<CreateMessageDto>,
  ): Promise<MessageEntity> {
    try {
      const newMessage = this.messageRepository.create({
        ...message,
        user_id: request.user.id,
      });
      return this.messageRepository.save(newMessage);
    } catch (error) {
      console.error('Error creating message:', error.message);
    }
  }
}
