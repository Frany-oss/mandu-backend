import { Module } from '@nestjs/common';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';
import { Division } from './divisions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subdivision } from 'src/components/subdivisions/subdivisions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Division]),
    TypeOrmModule.forFeature([Subdivision]),
  ],
  controllers: [DivisionsController],
  providers: [DivisionsService],
  exports: [DivisionsService],
})
export class DivisionsModule {}
