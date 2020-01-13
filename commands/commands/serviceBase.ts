import { Connection, Repository, createConnection } from 'typeorm';
import { getMysqlConnection } from './base';
class BaseService {
  async connectMysql(): Promise<Connection> {
    return await getMysqlConnection();
  }
}

export default BaseService;
