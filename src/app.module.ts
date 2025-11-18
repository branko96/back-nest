import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [DatabaseModule, AuthModule, CountriesModule],
})
export class AppModule {}


