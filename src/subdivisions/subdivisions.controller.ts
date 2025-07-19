/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SubdivisionsService } from './subdivisions.service';
import { CreateSubdivisionDto } from 'src/dtos/subdivision.create.dto';

@Controller('subdivisions')
export class SubdivisionsController {
  constructor(private readonly subdivisionsService: SubdivisionsService) {}

  @Post('division/:divisionId')
  @ApiOperation({
    summary: 'Crear una nueva subdivisión en una división específica',
  })
  @ApiParam({ name: 'divisionId', description: 'ID de la división padre' })
  @ApiResponse({ status: 201, description: 'Subdivisión creada exitosamente' })
  @ApiResponse({
    status: 404,
    description: 'La división especificada no existe',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una subdivisión con ese nombre',
  })
  async create(
    @Param('divisionId', ParseIntPipe) divisionId: number,
    @Body() createSubdivisionDto: CreateSubdivisionDto,
  ) {
    return await this.subdivisionsService.create(
      divisionId,
      createSubdivisionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las subdivisiones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de subdivisiones obtenida exitosamente',
  })
  async findAll() {
    return await this.subdivisionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una subdivisión por ID' })
  @ApiParam({ name: 'id', description: 'ID de la subdivisión' })
  @ApiResponse({ status: 200, description: 'Subdivisión encontrada' })
  @ApiResponse({ status: 404, description: 'Subdivisión no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.subdivisionsService.findOne(id);
  }

  @Get('division/:divisionId')
  @ApiOperation({
    summary: 'Obtener todas las subdivisiones de una división específica',
  })
  @ApiParam({ name: 'divisionId', description: 'ID de la división' })
  @ApiResponse({
    status: 200,
    description: 'Subdivisiones de la división obtenidas exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'La división especificada no existe',
  })
  async findByDivision(@Param('divisionId', ParseIntPipe) divisionId: number) {
    return await this.subdivisionsService.findByDivision(divisionId);
  }

  @Get('division/:divisionId/stats')
  @ApiOperation({
    summary:
      'Obtener estadísticas completas de una división y sus subdivisiones',
  })
  @ApiParam({ name: 'divisionId', description: 'ID de la división' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de la división obtenidas exitosamente',
  })
  @ApiResponse({ status: 404, description: 'División no encontrada' })
  async getDivisionStats(
    @Param('divisionId', ParseIntPipe) divisionId: number,
  ) {
    return await this.subdivisionsService.getDivisionStats(divisionId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una subdivisión' })
  @ApiParam({ name: 'id', description: 'ID de la subdivisión a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Subdivisión eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Subdivisión no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.subdivisionsService.remove(id);
    return { message: 'Subdivisión eliminada exitosamente' };
  }
}
