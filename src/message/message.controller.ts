import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageEntity } from './entities/message.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ResponseData } from 'src/global/globalClass';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  async findByConversation(@Param('id') id: number) {
    try {
      return new ResponseData<MessageEntity>(
        await this.messageService.findByConversation(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<MessageEntity>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async create(@Req() request: Request, @Body() message: CreateMessageDto) {
    return this.messageService.create(request, message);
  }
}
