import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { NOTIFICATIONS_COLLECTION } from '../database/database.module';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface Notification {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_COLLECTION)
    private readonly notificationsCollection: Collection<Notification>,
  ) {}

  async findAllByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.notificationsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return notifications.map((notification) => ({
      ...notification,
      _id: notification._id?.toString(),
    }));
  }

  async findOne(id: string, userId?: string): Promise<Notification> {
    const query: any = { _id: new ObjectId(id) as any };
    if (userId) {
      query.userId = userId;
    }

    const notification = await this.notificationsCollection.findOne(query);

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return {
      ...notification,
      _id: notification._id?.toString(),
    };
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification: Omit<Notification, '_id'> = {
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      read: dto.read ?? false,
      createdAt: new Date(),
    };

    const insertResult = await this.notificationsCollection.insertOne(
      notification as any,
    );

    const created = await this.notificationsCollection.findOne({
      _id: insertResult.insertedId,
    });

    if (!created) {
      throw new NotFoundException('No se pudo crear la notificación');
    }

    return {
      ...created,
      _id: created._id?.toString(),
    };
  }

  async update(
    id: string,
    dto: UpdateNotificationDto,
    userId?: string,
  ): Promise<Notification> {
    const query: any = { _id: new ObjectId(id) as any };
    if (userId) {
      query.userId = userId;
    }

    const notification = await this.notificationsCollection.findOne(query);

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    const updateData: Partial<Notification> = {};
    if (dto.read !== undefined) updateData.read = dto.read;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;

    await this.notificationsCollection.updateOne(
      query,
      { $set: updateData },
    );

    const updated = await this.notificationsCollection.findOne(query);

    if (!updated) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return {
      ...updated,
      _id: updated._id?.toString(),
    };
  }

  async markAsRead(id: string, userId?: string): Promise<Notification> {
    return this.update(id, { read: true }, userId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsCollection.updateMany(
      { userId, read: false },
      { $set: { read: true } },
    );
  }

  async remove(id: string, userId?: string): Promise<void> {
    const query: any = { _id: new ObjectId(id) as any };
    if (userId) {
      query.userId = userId;
    }

    const result = await this.notificationsCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notificación no encontrada');
    }
  }
}

