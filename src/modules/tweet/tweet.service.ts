import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { UserService } from '../user/user.service';
import { Tweet } from './entities/tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginater.interface';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider: PaginationProvider,
  ) { }

  public async createTweet(createTweetDto: CreateTweetDto) {
    // Find the user with the given userId
    const user = await this.userService.getUserById(createTweetDto.userId);
    if (!user) throw new Error(`User with id ${createTweetDto.userId} not found`);

    // Find the hashtags with the given ids
    const hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags ?? []);

    // Create a new tweet with the given user and hashtags
    const { userId, ...tweetData } = createTweetDto;
    const newTweet = this.tweetRepository.create({ ...tweetData, user, hashtags });

    // Save & return the tweet
    return await this.tweetRepository.save(newTweet);
  }

  public async getTweets(userId: number, pageQueryDto: PaginationQueryDto): Promise<Paginated<Tweet>> {
    // Find the user with the given userId
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} is not found`);

    // Find the tweets with the given user
    return await this.paginationProvider.paginateQuery(
      pageQueryDto, 
      this.tweetRepository,
      { user: { id: userId } }
    );
  }

  public async updateTweetById(id: number, tweetDto: UpdateTweetDto) {
    // Find the tweet with the given id
    const tweet = await this.tweetRepository.findOneBy({ id });
    if (!tweet) throw new Error(`Tweet with id ${id} not found`);

    // Find all the hashtags with the given ids
    const hashtags = await this.hashtagService.findHashtags(tweetDto.hashtags ?? []);

    // Update propertis of the tweet
    tweet.text = tweetDto.text ?? tweet.text;
    tweet.image = tweetDto.image ?? tweet.image;
    tweet.hashtags = hashtags;

    // Save the tweet
    return await this.tweetRepository.save(tweet);
  }

  public async deleteTweetById(id: number) {
    // Find the tweet with the given id
    const tweet = await this.tweetRepository.findOneBy({ id });
    if (!tweet) throw new Error(`Tweet with id ${id} not found`);

    // Delete the tweet
    await this.tweetRepository.delete(id);

    return { id, deleted: true, message: 'Tweet deleted successfully.' };
  }
}
