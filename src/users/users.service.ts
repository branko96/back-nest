import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { USERS_COLLECTION } from '../database/database.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  _id?: string;
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  countryCode?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_COLLECTION)
    private readonly usersCollection: Collection<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersCollection.find({}).toArray();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return {
        ...safeUser,
        _id: user._id?.toString(),
      };
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersCollection.findOne({
      _id: new ObjectId(id) as any,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return {
      ...safeUser,
      _id: user._id?.toString(),
    };
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersCollection.findOne({
      email: dto.email,
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const insertResult = await this.usersCollection.insertOne({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      lastname: dto.lastname,
      countryCode: dto.countryCode,
    });

    const created = await this.usersCollection.findOne({
      _id: insertResult.insertedId,
    });

    if (!created) {
      throw new ConflictException('No se pudo crear el usuario');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = created;
    return {
      ...safeUser,
      _id: created._id?.toString(),
    };
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersCollection.findOne({
      _id: new ObjectId(id) as any,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si se está actualizando el email, verificar que no esté en uso
    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersCollection.findOne({
        email: dto.email,
      });

      if (existing) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    const updateData: Partial<User> = {};
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.password !== undefined) updateData.password = dto.password;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.lastname !== undefined) updateData.lastname = dto.lastname;
    if (dto.countryCode !== undefined) updateData.countryCode = dto.countryCode;

    await this.usersCollection.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: updateData },
    );

    const updated = await this.usersCollection.findOne({
      _id: new ObjectId(id) as any,
    });

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updated;
    return {
      ...safeUser,
      _id: updated._id?.toString(),
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersCollection.deleteOne({
      _id: new ObjectId(id) as any,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}

