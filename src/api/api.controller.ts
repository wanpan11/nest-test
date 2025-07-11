import { Controller, Get } from '@nestjs/common';

import { ApiService } from './api.service';

@Controller('g')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  post() {
    return this.apiService.post();
  }
}
