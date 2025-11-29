import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: { _id: string }) {
    return this.notificationsService.findAllByUserId(user._id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { _id: string },
  ) {
    return this.notificationsService.findOne(id, user._id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser() user: { _id: string },
  ) {
    // Usar el userId del usuario autenticado si no se proporciona
    const dto = {
      ...createNotificationDto,
      userId: createNotificationDto.userId || user._id,
    };
    return this.notificationsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @CurrentUser() user: { _id: string },
  ) {
    return this.notificationsService.update(id, updateNotificationDto, user._id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { _id: string },
  ) {
    return this.notificationsService.markAsRead(id, user._id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@CurrentUser() user: { _id: string }) {
    await this.notificationsService.markAllAsRead(user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { _id: string },
  ) {
    await this.notificationsService.remove(id, user._id);
  }
}

