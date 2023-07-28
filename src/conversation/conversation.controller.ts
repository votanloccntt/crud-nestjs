import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationEntity } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async findAll(@Req() request: Request): Promise<ConversationEntity[]> {
    return this.conversationService.findAll(request);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body() conversation: CreateConversationDto,
  ) {
    return await this.conversationService.createConversation(
      request,
      conversation,
    );
  }
}