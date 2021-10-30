import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { throws } from 'assert';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) { }
  @Get()
  // getMyworkSpaces(@Param('myId', ParseIntPipe) myId: number) {
  //   return this.workspacesService.findMyWorkspaces(myId);
  // }
  async getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @Post(':url/members')
  inviteMembersToWorkspace() { }

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() { }

  @Get(':url/members')
  getMembersInfoInWorkspace() { }

  @Get(':url/users/:id')
  DEPRECATED_getMembersInfoInWorkspace() {
    this.getMembersInfoInWorkspace();
  }
}
