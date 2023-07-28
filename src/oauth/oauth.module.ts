import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { OauthEntity } from './entities/oauth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, OauthEntity]),
    JwtModule.register({
      global: true,
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [OauthService],
  controllers: [OauthController],
})
export class OauthModule {}
