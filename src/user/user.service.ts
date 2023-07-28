import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { encodePassword } from 'src/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly searchService: ElasticsearchService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const earthRadiusInKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = earthRadiusInKm * c;
    return distanceInKm;
  }

  async findByLatLng(id: number): Promise<UserEntity[]> {
    const currentUser = await this.userRepository.findOne({ where: { id } });
    if (!currentUser || !currentUser.lat || !currentUser.lng) {
      console.log('User không tồn tại');
    }

    const allUsers = await this.userRepository.find();

    const nearbyUsers = allUsers.filter((user) => {
      if (user.id === currentUser.id) {
        return false;
      }

      const distance = this.haversineDistance(
        parseFloat(currentUser.lat),
        parseFloat(currentUser.lng),
        parseFloat(user.lat),
        parseFloat(user.lng),
      );
      return distance < 1200;
    });

    return nearbyUsers;
  }

  async create(user: Partial<CreateUserDto>): Promise<UserEntity> {
    const password = encodePassword(user.password);
    const newuser = this.userRepository.create({ ...user, password });
    const currentUser = this.userRepository.save(newuser);
    await this.searchService.index({
      index: 'user',
      document: { ...newuser },
    });
    return currentUser;
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findOneById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
