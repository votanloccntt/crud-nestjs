import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  create(request: any, friendId: number) {
    const Friend = this.userRepository.findOne({
      where: { id: friendId },
    });
    if (!Friend) {
      throw new UnauthorizedException('Tài khoản kết bạn không tồn tại');
    }

    return this.friendRepository.save({
      friend_id: friendId,
      status: 1,
      user: {
        id: request.user.id,
      },
    });
  }
}
