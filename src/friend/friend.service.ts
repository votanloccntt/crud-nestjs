import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity)
    private friendRepository: Repository<FriendEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  create(request: Request, friendId: number) {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }
    const token = authorizationHeader.split(' ')[1];
    const checkLogin: any = this.jwtService.decode(token);
    if (!checkLogin) {
      throw new UnauthorizedException('incorrect token');
    }
    const checkFriend = this.userRepository.findOne({
      where: { id: friendId },
    });
    if (!checkFriend) {
      throw new UnauthorizedException('Tài khoản kết bạn không tồn tại');
    }
    return this.friendRepository.save({
      friend_id: friendId,
      status: 1,
      user: {
        id: checkLogin.id,
      },
    });
  }

  findAll() {
    return `This action returns all friend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
