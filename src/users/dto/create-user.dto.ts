export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  lastname?: string;
  countryCode?: string;
}

