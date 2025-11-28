import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Tweet } from './entities/tweet.entity';
import { HashtagModule } from '../hashtag/hashtag.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    UserModule,
    HashtagModule,
    PaginationModule,
  ],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule { }
