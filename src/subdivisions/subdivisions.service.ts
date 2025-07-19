/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subdivision } from './subdivisions.entity';
import {
  generateRandomCollaborators,
  generateRandomLevel,
} from 'src/shared/global.functions';
import { Division } from 'src/divisions/divisions.entity';
import { CreateSubdivisionDto } from 'src/dtos/subdivision.create.dto';

@Injectable()
export class SubdivisionsService {
  constructor(
    @InjectRepository(Subdivision)
    private readonly subdivisionRepository: Repository<Subdivision>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(
    divisionId: number,
    createSubdivisionDto: CreateSubdivisionDto,
  ): Promise<Subdivision> {
    const { nombre, embajadorNombre } = createSubdivisionDto;

    // Verificar que la división existe
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('La división especificada no existe');
    }

    // Verificar que el nombre sea único
    const existingSubdivision = await this.subdivisionRepository.findOne({
      where: { nombre },
    });

    if (existingSubdivision) {
      throw new ConflictException('Ya existe una subdivisión con ese nombre');
    }

    // Generar valores aleatorios para nivel y cantidad de colaboradores
    const nivel = generateRandomLevel();
    const cantidadColaboradores = generateRandomCollaborators();

    const subdivision = this.subdivisionRepository.create({
      nombre,
      divisionId,
      nivel,
      cantidadColaboradores,
      embajadorNombre: embajadorNombre || null,
    });

    const savedSubdivision = await this.subdivisionRepository.save(subdivision);

    // Actualizar el conteo de subdivisiones en la división
    await this.updateDivisionSubdivisionCount(divisionId);

    return savedSubdivision;
  }

  async findAll(): Promise<Subdivision[]> {
    return await this.subdivisionRepository.find({
      relations: ['division'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Subdivision> {
    const subdivision = await this.subdivisionRepository.findOne({
      where: { id },
      relations: ['division'],
    });

    if (!subdivision) {
      throw new NotFoundException('Subdivisión no encontrada');
    }

    return subdivision;
  }

  async findByDivision(divisionId: number): Promise<Subdivision[]> {
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('La división especificada no existe');
    }

    return await this.subdivisionRepository.find({
      where: { divisionId },
      relations: ['division'],
      order: { nombre: 'ASC' },
    });
  }

  async remove(id: number): Promise<void> {
    const subdivision = await this.findOne(id);
    const divisionId = subdivision.divisionId;

    await this.subdivisionRepository.remove(subdivision);

    // Actualizar el conteo de subdivisiones en la división
    await this.updateDivisionSubdivisionCount(divisionId);
  }

  // Método para obtener estadísticas de una división
  async getDivisionStats(divisionId: number): Promise<{
    division: Division;
    totalSubdivisions: number;
    totalCollaborators: number;
    subdivisions: Subdivision[];
  }> {
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('División no encontrada');
    }

    const subdivisions = await this.findByDivision(divisionId);
    const totalCollaborators = subdivisions.reduce(
      (sum, sub) => sum + sub.cantidadColaboradores,
      division.cantidadColaboradores,
    );

    return {
      division,
      totalSubdivisions: subdivisions.length,
      totalCollaborators,
      subdivisions,
    };
  }

  // Método auxiliar para actualizar el conteo de subdivisiones
  private async updateDivisionSubdivisionCount(
    divisionId: number,
  ): Promise<void> {
    const subdivisionCount = await this.subdivisionRepository.count({
      where: { divisionId },
    });

    await this.divisionRepository.update(divisionId, {
      cantidadSubdivisiones: subdivisionCount,
    });
  }
}
