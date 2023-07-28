import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TypeOrmModule.forFeature([ConversationEntity]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
