import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SemestersModule } from './semesters/semesters.module';

@Module({
  imports: [SemestersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
