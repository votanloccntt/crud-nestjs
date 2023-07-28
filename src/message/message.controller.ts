import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async findByConversation(@Param('id') id: number) {
    return await this.messageService.findByConversation(id);
  }

  @Post()
  async create(@Req() request: Request, @Body() message: CreateMessageDto) {
    return this.messageService.create(request, message);
  }
}
