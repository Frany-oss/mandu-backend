/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from 'src/dtos/divisions.create.dto';
import { UpdateDivisionDto } from 'src/dtos/divisions.update.dto';

@Controller('divisions')
export class DivisionsController {
  constructor(private readonly divisionService: DivisionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva división' })
  @ApiResponse({ status: 201, description: 'División creada exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una división con ese nombre',
  })
  async create(@Body() createDivisionDto: CreateDivisionDto) {
    const data = await this.divisionService.create(createDivisionDto);
    return data;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las divisiones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de divisiones obtenida exitosamente',
  })
  async findAll() {
    return await this.divisionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una división por ID' })
  @ApiParam({ name: 'id', description: 'ID de la división' })
  @ApiResponse({ status: 200, description: 'División encontrada' })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionService.findOne(id);
  }

  @Get(':id/subdivisions')
  @ApiOperation({ summary: 'Obtener las subdivisiones de una división' })
  @ApiParam({ name: 'id', description: 'ID de la división padre' })
  @ApiResponse({
    status: 200,
    description: 'Subdivisiones obtenidas exitosamente',
  })
  async findSubdivisiones(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionService.findSubdivisions(id);
  }

  @Get(':id/jerarquia-completa')
  @ApiOperation({ summary: 'Obtener la jerarquía completa de una división' })
  @ApiParam({ name: 'id', description: 'ID de la división' })
  @ApiResponse({
    status: 200,
    description: 'Jerarquía completa obtenida exitosamente',
  })
  async getFullHierarchy(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionService.getFullHierarchy(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una división' })
  @ApiParam({ name: 'id', description: 'ID de la división a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'División actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return await this.divisionService.update(id, updateDivisionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una división' })
  @ApiParam({ name: 'id', description: 'ID de la división a eliminar' })
  @ApiResponse({ status: 200, description: 'División eliminada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar una división con subdivisiones',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.divisionService.remove(id);
    return { message: 'División eliminada exitosamente' };
  }
}
