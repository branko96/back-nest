import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    const user = await this.usersCollection.findOne({
      email: dto.email,
      password: dto.password,
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    
    const payload = {
      sub: user._id?.toString(),
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        ...safeUser,
        _id: user._id?.toString(),
      },
      access_token,
    };
  }

  async register(dto: RegisterDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
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

    const payload = {
      sub: created._id?.toString(),
      email: created.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        ...safeUser,
        _id: created._id?.toString(),
      },
      access_token,
    };
  }
}


