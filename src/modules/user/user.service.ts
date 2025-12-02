import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { ConfigService } from '@nestjs/config';
import { UserAlreadyExistsException } from 'src/CustomExceptions/user-already-exists.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/paginater.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,
  ) { }

  public async createUser(userDto: CreateUserDto) {
    try {
      // Create a Profile & save
      userDto.profile = userDto.profile ?? {};

      // Check if the username or email already exists
      const existingUserWithUsername = await this.userRepository.findOne({
        where: { username: userDto.username },
      });
      if (existingUserWithUsername) throw new UserAlreadyExistsException('username', userDto.username);
      
      const existingUserWithEmail = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (existingUserWithEmail) throw new UserAlreadyExistsException('email', userDto.email);

      // Create a User Object
      const newUser = this.userRepository.create(userDto);

      // Save the user object
      return await this.userRepository.save(newUser);

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException('An error has occurred. Please try again later.', {
          description: 'Could not connect to the database',
        });
      }
      throw error;
    }
  }

  public async getAllUsers(pageQueryDto: PaginationQueryDto): Promise<Paginated<User>> {
    try {
      return await this.paginationProvider.paginateQuery(
        pageQueryDto,
        this.userRepository,
        undefined,
        ['profile']
      );
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException('An error has occurred. Please try again later.', {
          description: 'Could not connect to the database',
        });
      }
      console.log(error);
      throw error;
    }
  }

  public async getUserById(id: number) {
    try {
      // Find the user by id
      const user = await this.userRepository.findOneBy({ id });
  
      if (!user) throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        error: `User with id ${id} was not found`,
        table: 'users',
      }, HttpStatus.NOT_FOUND, {
        description: `The exception occured because the user with id ${id} was not found`,
      });
  
      return user;
      
    } catch (error) {
      throw error;
    }
  }

  updateUserById(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async deleteUserById(id: number) {
    // Delete the user
    await this.userRepository.delete(id);

    // Return a response or a status
    return { message: 'User (and profile, if existed) deleted successfully.', deleted: true };
  }
}
