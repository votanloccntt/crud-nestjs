import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationEntity } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from 'src/oauth/auth.guard';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() request: Request): Promise<ConversationEntity[]> {
    return this.conversationService.findAll(request);
  }

  @UseGuards(AuthGuard)
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
