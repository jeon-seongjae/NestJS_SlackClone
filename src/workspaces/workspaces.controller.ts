import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  @Get()
  getMyworkSpaces() {}

  @Post()
  createWorkSpace() {}

  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members')
  getMembersInfoInWorkspace() {}

  @Get(':url/users/:id')
  DEPRECATED_getMembersInfoInWorkspace() {
    this.getMembersInfoInWorkspace();
  }
}
