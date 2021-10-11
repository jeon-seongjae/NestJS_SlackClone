import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {
  // @ApiProperty({
  //   example: 'tjdwoek62@gmail.com',               이 주석부분들이 PickType으로 user엔티티를 상속하면서 필요없어 진다.
  //   description: '이메일',
  //   required: true,
  // })
  // public email: string;
  // @ApiProperty({
  //   example: '대통령',
  //   description: '닉네임',
  //   required: true,
  // })
  // public nickname: string;
  // @ApiProperty({
  //   example: 'test',
  //   description: '비밀번호',
  //   required: true,
  // })
  // public password: string;
}
