// import { Entity, Connection, Repository } from 'typeorm';
// import { getMysqlConnection } from './base';

// class BaseService {
//   async connectMysql(): Promise<Connection> {
//     return await getMysqlConnection();
//   }
//   async getRepository<T>(entity): Promise<Repository<T>> {
//     let connection: Connection = await this.connectMysql();
//     return connection.getRepository(entity);
//   }
// }

// export default BaseService;
