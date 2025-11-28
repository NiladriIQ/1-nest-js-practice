import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { In, Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) { }

  public async createHashtag(createHashtagDto: CreateHashtagDto) {
    const newHashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(newHashtag);
  }

  findAll() {
    return `This action returns all hashtag`;
  }

  public async getHashtagById(id: number) {
    return await this.hashtagRepository.findOneBy({ id });
  }

  public async findHashtags(ids: number[]) {
    if (ids.length === 0) return [];
    return await this.hashtagRepository.findBy({ id: In(ids) });
  }

  update(id: number, updateHashtagDto: UpdateHashtagDto) {
    return `This action updates a #${id} hashtag`;
  }

  public async deleteHashtagById(id: number) {
    // Find the hashtag with the given id
    const hashtag = await this.hashtagRepository.findOneBy({ id });
    if (!hashtag) throw new Error(`Hashtag with id ${id} not found`);

    // Delete the hashtag
    await this.hashtagRepository.delete(id);

    return { id, deleted: true, message: 'Hashtag deleted successfully.' };
  }
  
  public async softDeleteHashtagById(id: number) {
    // Find the hashtag with the given id
    const hashtag = await this.hashtagRepository.findOneBy({ id });
    if (!hashtag) throw new Error(`Hashtag with id ${id} not found`);

    // Soft delete the hashtag
    await this.hashtagRepository.softDelete(id);

    return { id, deleted: true, message: 'Hashtag deleted successfully.' };
  }
}
