import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() createUser: UserEntity) {
    return await this.userService.create(createUser);
  }

  @Get(':id')
  async findByLatLng(@Param('id') id: number) {
    return await this.userService.findByLatLng(id);
  }
}
