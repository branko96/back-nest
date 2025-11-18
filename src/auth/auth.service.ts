import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Collection } from 'mongodb';
import { USERS_COLLECTION } from '../database/database.module';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface User {
  _id?: string;
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  countryCode?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_COLLECTION)
    private readonly usersCollection: Collection<User>,
  ) {}

  async login(dto: LoginDto): Promise<User> {
    const user = await this.usersCollection.findOne({
      email: dto.email,
      password: dto.password,
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser as User;
  }

  async register(dto: RegisterDto): Promise<User> {
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
    return safeUser as User;
  }
}


