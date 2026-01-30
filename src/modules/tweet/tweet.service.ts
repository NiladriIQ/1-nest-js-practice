import { BadRequestException, ConflictException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { UserService } from '../user/user.service';
import { Tweet } from './entities/tweet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagService } from '../hashtag/hashtag.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginater.interface';
import { User } from '../user/entities/user.entity';
import { Hashtag } from '../hashtag/entities/hashtag.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly userService: UserService,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider: PaginationProvider,
  ) { }

  public async createTweet(createTweetDto: CreateTweetDto, userId: number) {
    let user: User | undefined = undefined;
    let hashtags: Hashtag[] | undefined = undefined;
    try {
      // Find the user with the given userId
      user = await this.userService.getUserById(userId);

      // Find the hashtags with the given ids
      if (createTweetDto.hashtags) {
        hashtags = await this.hashtagService.findHashtags(createTweetDto.hashtags ?? []);
      }
    } catch (error) {
      throw new RequestTimeoutException();
    }
    if (createTweetDto.hashtags?.length != hashtags?.length) throw new BadRequestException();

    // Create a new tweet with the given user and hashtags
    const newTweet = this.tweetRepository.create({ ...createTweetDto, user, hashtags });

    try {
      // Save & return the tweet
      return await this.tweetRepository.save(newTweet);
    } catch (error) {
      throw new ConflictException(error);
    }
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
