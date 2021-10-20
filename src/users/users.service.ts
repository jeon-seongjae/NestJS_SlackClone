// import {
//   BadRequestException,
//   HttpException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Users } from '../../src/entities/Users';
// import bcrypt from 'bcrypt';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectRepository(Users)
//     private usersRepository: Repository<Users>,
//   ) {}

//   async join(email: string, nickname: string, password: string) {
//     // if (!email) {  // dto에서 class-validator로 처리하면 이런 거 작성안해도 된다.
//     //   // 이메일 없으서 에러
//     //   // throw new Error('이메일이 없습니다.');  이렇게 async안에서 error을 하면 그냥 경고메세지만 뜨고 클라이언트에서는 성공했다고 표시됨
//     //   throw new BadRequestException('이메일이 없습니다.');
//     // }
//     // if (!nickname) {
//     //   // 닉네임 없을 시 에러
//     //   throw new BadRequestException('닉네임이 없습니다.');
//     // }
//     // if (!password) {
//     //   // 비밀번호 없을 시 에러
//     //   throw new BadRequestException('비밀번호가 없습니다.');
//     // }
//     const user = await this.usersRepository.findOne({ where: { email } });
//     if (user) {
//       // 이미 존재하는 유저기 때문에 에러
//       // throw new Error('이미 존재하는 유저 입니다.'); throw는 return기능도 수행한다.
//       throw new UnauthorizedException('이미 존재하는 유저 입니다.');
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     await this.usersRepository.save({
//       email,
//       nickname,
//       password: hashedPassword,
//     });
//   }
// }
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ChannelMembers } from '../entities/ChannelMembers';

import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create();
      workspaceMember.UserId = returned.id;
      workspaceMember.WorkspaceId = 1;
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
