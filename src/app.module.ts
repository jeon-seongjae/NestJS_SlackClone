import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, WorkspacesModule, ChannelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // middleware들은 consumer에 연결한다.
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 라우츠 전체에 미들웨어 적용하겠다
  }
}
