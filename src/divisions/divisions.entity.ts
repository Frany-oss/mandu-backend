import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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
    name: 'division_superior_id',
    type: 'int',
    nullable: true,
  })
  divisionSuperiorId: number | null;

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
    name: 'embajador_nombre',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  embajadorNombre: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
