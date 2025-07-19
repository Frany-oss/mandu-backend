import { Subdivision } from 'src/subdivisions/subdivisions.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('divisions')
// @Index(['nombre'], { unique: true })
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 45,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  nivel: number;

  @Column({
    name: 'cantidad_colaboradores',
    type: 'int',
    nullable: false,
  })
  cantidadColaboradores: number;

  @Column({
    name: 'division_superior_id',
    type: 'int',
    nullable: true,
  })
  divisionSuperiorId: number | null;

  @Column({
    name: 'embajador_nombre',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  embajadorNombre: string | null;

  // Field to count subdivisions
  @Column({
    name: 'cantidad_subdivisiones',
    type: 'int',
    nullable: false,
    default: 0,
  })
  cantidadSubdivisiones: number;

  // Relación One-to-Many: Una división puede tener múltiples subdivisiones
  @OneToMany(() => Subdivision, (subdivision) => subdivision.division, {
    cascade: true,
    nullable: true,
  })
  subdivisions: Subdivision[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
