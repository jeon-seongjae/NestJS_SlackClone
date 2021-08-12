import { Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspace/:url/dms')
export class DmsController {
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    // @Query('perPage') perPage, @Query('page') page // 위에 쿼리를 전체 다받는 걸로 써도 되고 이렇게 따로 받게 할 수도 있다.
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':id/chats')
  postChat() {}
}
