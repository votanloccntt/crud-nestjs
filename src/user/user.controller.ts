import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'src/global/globalClass';
import { UserEntity } from './entities/user.entity';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<ResponseData<UserEntity[]>> {
    try {
      return new ResponseData<UserEntity[]>(
        await this.userService.findAll(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserEntity[]>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body() createUser: UserEntity,
  ): Promise<ResponseData<UserEntity>> {
    try {
      await this.userService.create(createUser);
      return new ResponseData<UserEntity>(
        await this.userService.findOneByEmail(createUser.email),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserEntity>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get(':id')
  async findByLatLng(
    @Param('id') id: number,
  ): Promise<ResponseData<UserEntity[]>> {
    try {
      return new ResponseData<UserEntity[]>(
        await this.userService.findByLatLng(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<UserEntity[]>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
