import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    TypeOrmModule.forRoot({
      username: 'postgres',
      type: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
