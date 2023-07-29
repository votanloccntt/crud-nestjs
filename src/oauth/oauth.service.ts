import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePasswords } from 'src/bcrypt';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { OauthEntity } from './entities/oauth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(OauthEntity)
    private oauthRepository: Repository<OauthEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    const checkPwd = comparePasswords(password, user.password);

    if (!checkPwd) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const token = await this.jwtService.signAsync(payload);

    const checkToken = await this.oauthRepository.findOne({
      where: { user: { email: email } },
      relations: { user: true },
    });

    if (checkToken) {
      await this.oauthRepository.update(
        { user: { id: checkToken.user.id } },
        { access_token: token },
      );
    } else {
      await this.oauthRepository.save({
        access_token: token,
        user: {
          id: user.id,
        },
        status: 1,
      });
    }
    return {
      access_token: token,
    };
  }
}
