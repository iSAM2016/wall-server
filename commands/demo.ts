import Base from './base';
import { Command } from '@adonisjs/ace';
import { CommonModuleInterface } from './interface';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
// import Util from '~/src/library/utils/modules/util'

class CommandDemo extends Base implements CommonModuleInterface {
  static get signature() {
    return `
    Command:Demo

     {user:[必传]用户名}
     {name?:[可选]称谓}

     {--onlyFlag:[必传]flag,只有true/false两个值}
     {--logName=@value:[必传]日志文件名}
     {--isTest?=@value:[可选]是否处于测试环境}
     `;
  }

  static get description() {
    return '解析kafka日志, 分析pv';
  }

  async execute(args, options) {
    this.log('Command:Demo start');
    // throw Error('testEror');
    let { user, name } = args;
    let { onlyFlag, logName, isTest } = options;

    // console.log(args);
    this.log('user =>', user);
    // this.log(`CommandDemo, name=> ${name}`);
    // this.log(`CommandDemo, onlyFlag=> ${onlyFlag}`);
    // this.log(`CommandDemo, logName=> ${logName}`);
    // this.log(`CommandDemo, isTest=> ${isTest}`);
    this.log('Command:Demo finish');
  }
}

export default CommandDemo;

// class PersonDAO {
//   email: string;
//   password: string;
// }
// @Singleton
// class PersonService {
//   private personDAO: PersonDAO;
//   constructor() {
//     this.personDAO = {
//       email: '12289',
//       password: '123',
//     };
//   }
//   getEmail() {
//     console.log(this.personDAO.email);
//   }
//   setEmail(value) {
//     this.personDAO.email = value;
//   }
// }
// class PersonController {
//   @Inject
//   private personService: PersonService;
//   public getEmail() {
//     this.personService.getEmail();
//   }
//   public setEmail(value) {
//     this.personService.setEmail(value);
//   }
// }

// let controller1: PersonController = new PersonController();
// let controller2: PersonController = new PersonController();
// controller1.getEmail();
// controller2.getEmail();
// controller1.setEmail('9090');
// controller1.getEmail();
// controller2.getEmail();

// abstract class IBaseType {
//   public abstract method1(): void;
// }

// @Provides(IBaseType)
// export default class ChildType implements IBaseType {
//   public method1(): void {
//     // tslint:disable-next-line:no-console
//     console.log('Foo bar');
//   }
// }

// export class Worker {
//   @Inject public type: IBaseType;

//   public work() {
//     this.type.method1();
//   }
// }
// let work1: Worker = new Worker();
// work1.work();
/////////////////////////////////////////////
