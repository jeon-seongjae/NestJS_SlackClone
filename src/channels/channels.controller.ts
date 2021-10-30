import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { throws } from 'assert';
import { User } from 'src/common/decorators/user.decorator';
import { ChannelsService } from './channels.service';
import { PostChatDto } from './dto/post-chat.dto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Users } from 'src/entities/Users';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) { }
  @Get()
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @Post()
  createChannels() { }

  @Get(':name')
  getSpecificChannel(@Param('name') name: string) { }

  @Get(':name/chats')
  getChats(@Param('url') url: string, @Param('name') name: string, @Query() query, @Param() param) {
    // @Query('perPage') perPage, @Query('page') page // 위에 쿼리를 전체 다받는 걸로 써도 되고 이렇게 따로 받게 할 수도 있다.
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
    return this.channelsService.getWorkspaceChannelChats(url, name, query.perPage, query.page);
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() body: PostChatDto,
    @User() user
  ) {
    return this.channelsService.postChat({ url, content: body.content, name, myId: user.id });
  }

  @UseInterceptors(FilesInterceptor('image', 10, {
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  @Post(':name/images')
  postImages(@Param('url') url,
    @Param('name') name,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: Users
  ) {
    return this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
      user.id,
    );
  }

  @Get(':name/unreads')
  getUnread(@Param('url') url: string, @Param('name') name: string, @Query('after') after: number) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @Post(':name/members')
  inviteMembers() { }
}
