import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  public createHashtag(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagService.createHashtag(createHashtagDto);
  }

  @Get()
  findAll() {
    return this.hashtagService.findAll();
  }

  @Get(':id')
  public getHashtagById(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.getHashtagById(id);
  }

  // @Get(':ids')
  // public findHashtags(@Param('ids', ParseIntPipe) ids: number[]) {
  //   return this.hashtagService.findHashtags(ids);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashtagDto: UpdateHashtagDto) {
    return this.hashtagService.update(+id, updateHashtagDto);
  }

  @Delete(':id')
  public deleteHashtagById(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.deleteHashtagById(id);
  }

  @Delete('soft-delete/:id')
  public softDeleteHashtagById(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.softDeleteHashtagById(id);
  }
}
