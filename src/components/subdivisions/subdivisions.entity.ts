import { Division } from 'src/components/divisions/divisions.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subdivisions')
export class Subdivision {
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
    name: 'division_id',
    type: 'int',
    nullable: false,
  })
  divisionId: number;

  // Relación Many-to-One: Una subdivisión pertenece a una división
  @ManyToOne(() => Division, (division) => division.subdivisions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'division_id' })
  division: Division;

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
