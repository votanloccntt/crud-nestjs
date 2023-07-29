import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/oauth/auth.guard';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  create(@Req() request: Request, @Param('id') id: number) {
    return this.friendService.create(request, id);
  }
}
