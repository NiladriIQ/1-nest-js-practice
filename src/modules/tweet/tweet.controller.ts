import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) { }

  @Post()
  public createTweet(@Body() tweetDto: CreateTweetDto, @ActiveUser('sub') userId: number) {
    return this.tweetService.createTweet(tweetDto, userId);
  }

  @Get(':userId')
  public getTweets(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.tweetService.getTweets(userId, paginationQueryDto);
  }

  @Patch(':id')
  public updateTweetById(
    @Param('id', ParseIntPipe) id: number,
    @Body() tweetDto: UpdateTweetDto,
  ) {
    return this.tweetService.updateTweetById(id, tweetDto);
  }

  @Delete(':id')
  public deleteTweetById(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.deleteTweetById(id);
  }
}
