import { Module } from '@nestjs/common';
import { SubdivisionsController } from './subdivisions.controller';
import { SubdivisionsService } from './subdivisions.service';
import { Subdivision } from './subdivisions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from 'src/divisions/divisions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subdivision]),
    TypeOrmModule.forFeature([Division]),
  ],
  controllers: [SubdivisionsController],
  providers: [SubdivisionsService],
  exports: [],
})
export class SubdivisionsModule {}
