import { IsString } from 'class-validator';
import { ConversationEntity } from '../entities/conversation.entity';

export class CreateConversationDto extends ConversationEntity {
  @IsString()
  name: string;
  @IsString()
  avatar: string;
}
