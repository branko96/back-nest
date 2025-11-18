import { Controller, Get } from '@nestjs/common';

interface Country {
  code: string;
  name: string;
}

@Controller('countries')
export class CountriesController {
  @Get()
  findAll(): Country[] {
    // Lista simple de ejemplo; puedes ampliarla según tus necesidades
    return [
      { code: 'AR', name: 'Argentina' },
      { code: 'BR', name: 'Brasil' },
      { code: 'CL', name: 'Chile' },
      { code: 'UY', name: 'Uruguay' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'ES', name: 'España' },
      { code: 'MX', name: 'México' },
    ];
  }
}


