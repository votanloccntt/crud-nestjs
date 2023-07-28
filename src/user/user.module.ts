import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { FriendEntity } from 'src/friend/entities/friend.entity';
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
    TypeOrmModule.forFeature([UserEntity, FriendEntity]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
