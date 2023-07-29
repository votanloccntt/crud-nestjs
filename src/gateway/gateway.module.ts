import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { JwtService } from '@nestjs/jwt';
import { MyGateway } from './gateway';
import { MessageEntity } from 'src/message/entities/message.entity';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConnectionEntity,
      MessageEntity,
      ConversationEntity,
    ]),
  ],
  providers: [JwtService, MyGateway],
})
export class GatewayModule {}
