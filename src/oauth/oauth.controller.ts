import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { OauthService } from './oauth.service';

@Controller('auth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(':login')
  async login(@Body() userLogin: UserEntity) {
    return await this.oauthService.validateUser(
      userLogin.email,
      userLogin.password,
    );
  }
}
