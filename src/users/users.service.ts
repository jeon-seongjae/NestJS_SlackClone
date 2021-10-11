import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../src/entities/Users';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async join(email: string, nickname: string, password: string) {
    if (!email) {
      // 이메일 없으서 에러
      // throw new Error('이메일이 없습니다.');  이렇게 async안에서 error을 하면 그냥 경고메세지만 뜨고 클라이언트에서는 성공했다고 표시됨
      throw new HttpException('이메일이 없습니다.', 400);
    }
    if (!nickname) {
      // 닉네임 없을 시 에러
      throw new HttpException('닉네임이 없습니다.', 400);
    }
    if (!password) {
      // 비밀번호 없을 시 에러
      throw new HttpException('비밀번호가 없습니다.', 400);
    }
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      // 이미 존재하는 유저기 때문에 에러
      // throw new Error('이미 존재하는 유저 입니다.'); throw는 return기능도 수행한다.
      throw new HttpException('이미 존재하는 유저 입니다.', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
