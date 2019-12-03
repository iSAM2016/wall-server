import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterEntity } from './entity/register.entity';
@Injectable()
export class AuthService {
  constructor() // @InjectRepository(Repository)
  // private readonly registoryRepository: Repository<RegisterEntity>,
  {}

  async register(register: RegisterEntity) {
    const { loginname, email } = register;
    // const userExist = this.registoryRepository.find();
  }

  async findAll() {}
}
