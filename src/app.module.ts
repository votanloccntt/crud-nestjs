import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationEntity } from './conversation/entities/conversation.entity';
import { MessageEntity } from './message/entities/message.entity';
import { OauthEntity } from './oauth/entities/oauth.entity';
import { UserEntity } from './user/entities/user.entity';
import { OauthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { SearchModule } from './search/search.module';
import { FriendModule } from './friend/friend.module';
import { FriendEntity } from './friend/entities/friend.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConnectionEntity } from './gateway/entities/connection.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        FriendEntity,
        ConversationEntity,
        MessageEntity,
        OauthEntity,
        UserEntity,
        ConnectionEntity,
      ],
    }),
    GatewayModule,
    UserModule,
    MessageModule,
    ConversationModule,
    OauthModule,
    SearchModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
