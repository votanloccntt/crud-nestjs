import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { JwtService } from '@nestjs/jwt';
import { MyGateway } from './gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionEntity])],
  providers: [JwtService, MyGateway],
})
export class GatewayModule {}
