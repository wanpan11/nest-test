import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  post() {
    return [1, 2, 3, 4, 5];
  }
}
