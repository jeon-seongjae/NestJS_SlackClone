import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { WorkspacesController } from './workspaces/workspaces.controller';
import { WorkspacesService } from './workspaces/workspaces.service';
import { DmsModule } from './dms/dms.module';
import { DmsService } from './dms/dms.service';
import { DmsController } from './dms/dms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  // express에서 app.use이런 개념을 nest에서는 모듈로 사용한다고 생각하면 됨
  imports: [
    ConfigModule.forRoot(), // forRoot 이런 건 설정이라고 보면 된다.
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot(ormconfig),
    EventsModule,
  ],
  controllers: [AppController, DmsController, WorkspacesController],
  providers: [AppService, DmsService, WorkspacesService],
})
export class AppModule implements NestModule {
  // middleware들은 consumer에 연결한다.
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 라우츠 전체에 미들웨어 적용하겠다
  }
}
