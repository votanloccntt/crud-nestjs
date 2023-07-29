import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/oauth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUser: UserEntity) {
    return await this.userService.create(createUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByLatLng(@Req() request: Request) {
    return await this.userService.findByLatLng(request);
  }
}
