import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Division } from './divisions.entity';
import { CreateDivisionDto } from 'src/dtos/divisions.create.dto';
import { UpdateDivisionDto } from 'src/dtos/divisions.update.dto';
import {
  generateRandomCollaborators,
  generateRandomLevel,
} from 'src/shared/global.functions';
import { Subdivision } from 'src/subdivisions/subdivisions.entity';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto): Promise<Division> {
    const { nombre, divisionSuperiorNombre, embajadorNombre } =
      createDivisionDto;

    // Verificar que el nombre sea único
    const existingDivision = await this.divisionRepository.findOne({
      where: { nombre },
    });

    if (existingDivision) {
      throw new ConflictException('Ya existe una división con ese nombre');
    }

    let divisionSuperior: Division | null = null;
    let divisionSuperiorId: number | null = null;

    // Si se especifica una división superior, verificar que existe
    if (divisionSuperiorNombre) {
      divisionSuperior = await this.divisionRepository.findOne({
        where: { nombre: divisionSuperiorNombre },
      });

      if (!divisionSuperior) {
        throw new NotFoundException(
          'La división superior especificada no existe',
        );
      }
      divisionSuperiorId = divisionSuperior.id;
    }

    // Generar valores aleatorios para nivel y cantidad de colaboradores
    const nivel = generateRandomLevel();
    const cantidadColaboradores = generateRandomCollaborators();

    const division = this.divisionRepository.create({
      nombre,
      divisionSuperiorId: divisionSuperiorId || null,
      nivel,
      cantidadColaboradores,
      embajadorNombre: embajadorNombre || null,
      divisionSuperiorNombre: divisionSuperiorNombre,
    });

    return await this.divisionRepository.save(division);
  }

  async findAll(): Promise<Division[]> {
    return await this.divisionRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id },
    });

    if (!division) {
      throw new NotFoundException('División no encontrada');
    }

    return division;
  }

  async findSubdivisions(divisionId: number): Promise<Subdivision[]> {
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId },
    });

    if (!division) {
      throw new NotFoundException('División no encontrada');
    }

    // Buscar todas las subdivisiones de la división especificada usando la relación
    const divisionWithSubdivisions = await this.divisionRepository.findOne({
      where: { id: divisionId },
      relations: ['subdivisions'],
    });

    return divisionWithSubdivisions?.subdivisions || [];
  }

  async update(
    id: number,
    updateDivisionDto: UpdateDivisionDto,
  ): Promise<Division> {
    const division = await this.findOne(id);

    // Si se actualiza el nombre, verificar unicidad
    if (
      updateDivisionDto.nombre &&
      updateDivisionDto.nombre !== division.nombre
    ) {
      const existingDivision = await this.divisionRepository.findOne({
        where: { nombre: updateDivisionDto.nombre },
      });

      if (existingDivision) {
        throw new ConflictException('Ya existe una división con ese nombre');
      }
    }

    Object.assign(division, updateDivisionDto);
    return await this.divisionRepository.save(division);
  }

  async remove(id: number): Promise<void> {
    const division = await this.findOne(id);

    if (division.cantidadSubdivisiones > 0) {
      throw new BadRequestException(
        'No se puede eliminar una división que tiene subdivisiones. Elimine o reasigne las subdivisiones primero.',
      );
    }

    // TODO: Si es una division superior que no deje eliminarla

    // TODO: Eliminar todas las subdivisiones

    await this.divisionRepository.remove(division);
  }

  // Método auxiliar para detectar ciclos en la jerarquía
  private async wouldCreateCycle(
    divisionId: number,
    newParentId: number,
  ): Promise<boolean> {
    let currentParentId: number | null = newParentId;

    while (currentParentId) {
      if (currentParentId === divisionId) {
        return true; // Ciclo detectado
      }

      const parent = await this.divisionRepository.findOne({
        where: { id: currentParentId },
        select: ['divisionSuperiorId'],
      });

      currentParentId = parent?.divisionSuperiorId || null;
    }

    return false;
  }

  // Obtener el árbol jerárquico completo de una división
  async getFullHierarchy(divisionId: number): Promise<any> {
    const division = await this.findOne(divisionId);

    const buildTree = async (div: Division): Promise<any> => {
      const subdivisiones = await this.divisionRepository.find({
        where: { divisionSuperiorId: div.id },
        order: { nombre: 'ASC' },
      });

      return {
        ...div,
        subdivisiones: await Promise.all(subdivisiones.map(buildTree)),
      };
    };

    return await buildTree(division);
  }
}
