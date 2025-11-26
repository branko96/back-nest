import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Collection, ObjectId } from 'mongodb';
import { USERS_COLLECTION } from '../../database/database.module';
import { User } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_COLLECTION)
    private readonly usersCollection: Collection<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersCollection.findOne({
      _id: new ObjectId(payload.sub) as any,
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return {
      ...safeUser,
      _id: user._id?.toString(),
    };
  }
}



