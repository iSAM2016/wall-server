// function f() {
//   console.log('f(): evaluated');
//   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
//     let oldMethod = descriptor.value;
//     console.log('f');
//     descriptor.value = function(...arg) {
//       console.log('f start');
//       // console.log(JSON.stringify(oldMethod));
//       let value = oldMethod.apply(this, arguments);
//       console.log('f' + value);
//       console.log('f end');
//     };
//   };
// }

// function g() {
//   console.log('g(): evaluated');
//   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
//     let oldMethod = descriptor.value;
//     console.log('g');
//     descriptor.value = function(...arg) {
//       console.log('g start');
//       let value = oldMethod.apply(this, arguments);
//       console.log('g' + value);
//       console.log('g end');
//       return value + 'tom';
//     };
//   };
// }
// function d() {
//   console.log('d(): evaluated');
//   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
//     let oldMethod = descriptor.value;
//     console.log('d');
//     descriptor.value = function(...arg) {
//       console.log('d start');
//       let value = oldMethod.apply(this, arguments);
//       console.log('d' + value);
//       console.log('d end');
//       return value + 'd';
//     };
//   };
// }

// class C {
//   @f()
//   @g()
//   @d()
//   method() {
//     console.log(9);
//     return 'isam2026';
//   }
// }
// let c = new C();

// c.method();

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
