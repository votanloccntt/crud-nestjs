import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { JwtService } from '@nestjs/jwt';
import { MyGateway } from './gateway';
import { MessageEntity } from 'src/message/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionEntity, MessageEntity])],
  providers: [JwtService, MyGateway],
})
export class GatewayModule {}
