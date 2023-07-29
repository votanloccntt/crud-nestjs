import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from 'src/oauth/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async findByConversation(@Req() request: Request, @Param('id') id: number) {
    return await this.messageService.findByConversation(request, id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() request: Request, @Body() message: CreateMessageDto) {
    return this.messageService.create(request, message);
  }
}
