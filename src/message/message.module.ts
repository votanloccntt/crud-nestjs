import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { OauthEntity } from 'src/oauth/entities/oauth.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        cloud: {
          id: '0c406b2842f34e47924ebd89c7656660:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ3ZDFhNzQ3ZWUyNjI0NDRmYmQwZWU5YzE2ODlmZWYxZSRmMDUxZTA1NmUxMGU0ZGY0OTBmNWU3MjU5ZTZmMTYxNA==',
        },
        auth: {
          username: 'elastic',
          password: 'BAONsP717rwyx5HxHES6MEfd',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([MessageEntity, OauthEntity, ConversationEntity]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
