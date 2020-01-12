let fun = (...arg) => {
  console.log('log start');
};
let fun2 = (...arg) => {
  console.log('log end');
};

@modifyClass('new Prop')
class A {
  @modifyProp type: string;
  name: string;

  constructor(name) {
    this.name = name;
  }
  @modifyMethod('BEFORE', fun)
  @modifyMethod('AFTER', fun2)
  say(@modifyParam word) {
    console.log('word is' + word);
    // let str = Reflect.getMetadata(key, this);
    // console.log(str);
  }
}

// 在装饰类的装饰器上获得target(类)是类本身
// 在装饰属性、方法、入参上获得的target的是类的原型target(属性、方法、入参) === target(类).prototype
function modifyClass(param) {
  console.log('class start');
  return target => {
    Reflect.defineMetadata(Symbol.for('META_PARAM'), param, target.prototype);
  };
}

function modifyProp(target, propertyKey) {
  // 修改属性
  // console.log(target);
  // console.log(propertyKey);
  // console.log('99');
  target[propertyKey] = 'modfiyed by decorator';
}

// 修饰方法
// descriptor对象原来的值如下
// {
//   value: specifiedFunction,
//   enumerable: false,
//   configurable: true,
//   writable: true
// };

function modifyMethod(type, func) {
  return (target, propetyKey, descriptor) => {
    let oldMethod = descriptor.value;
    if (type == 'BEFORE') {
      descriptor.value = function() {
        func(...arguments);
        return oldMethod.apply(this, arguments);
      };
    } else if (type == 'AFTER') {
      descriptor.value = function() {
        let result = oldMethod.apply(this, arguments);
        func(...arguments);
        return result;
      };
    }
  };
}

// 修饰入参
// index 是这个参数的顺序
function modifyParam(target, propertyKey, index) {
  // console.log(target);
  // console.log(propertyKey);
  // console.log(index);
}
let a = new A('isam217');
a.say('isam2016');

// function AOP(type, func) {
//   return (target, propetyKey, descriptor) => {
//     let oldMethod = descriptor.value;
//     if (type == 'BEFORE') {
//       descripotor.value = function() {
//         fun(...arguments);
//         return oldMethod.apply(this, arguments);
//       };
//     } else if (type == 'AFTER') {
//       descripotor.value = function() {
//         let result = oldMethod.apply(this, arguments);
//         fun(...arguments);
//         return result;
//       };
//     }
//   };
// }

function f() {
  console.log('f(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    let oldMethod = descriptor.value;
    console.log('f');
    descriptor.value = function(...arg) {
      console.log('f start');
      // console.log(JSON.stringify(oldMethod));
      let value = oldMethod.apply(this, arguments);
      console.log('f' + value);
      console.log('f end');
    };
  };
}

function g() {
  console.log('g(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    let oldMethod = descriptor.value;
    console.log('g');
    descriptor.value = function(...arg) {
      console.log('g start');
      let value = oldMethod.apply(this, arguments);
      console.log('g' + value);
      console.log('g end');
      return value + 'tom';
    };
  };
}
function d() {
  console.log('d(): evaluated');
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    let oldMethod = descriptor.value;
    console.log('d');
    descriptor.value = function(...arg) {
      console.log('d start');
      let value = oldMethod.apply(this, arguments);
      console.log('d' + value);
      console.log('d end');
      return value + 'd';
    };
  };
}

class C {
  @f()
  @g()
  @d()
  method() {
    console.log(9);
    return 'isam2026';
  }
}
let c = new C();

c.method();

// function modifyProp(target, propertyKey) {
//   // 修改属性
//   // console.log(target);
//   // console.log(propertyKey);
//   // console.log('99');
//   // target[propertyKey] = 'modfiyed by decorator';

//   let logHandler = {};
//   const propKey = `__${propertyKey}`;
//   Object.defineProperty(target, propertyKey, {
//     enumerable: true,
//     get: async function() {
//       // console.log(`${key} 被读取`);
//       let config = new ConfigService();
//       return await createConnection({
//         type: 'mysql',
//         name: 'commond',
//         host: String(config.get('MYSQL_HOST')),
//         port: Number(config.get('MYSQL_PORT')),
//         username: String(config.get('MYSQL_USERNAME')),
//         password: String(config.get('MYSQL_PASSWORD')),
//         database: String(config.get('MYSQL_DATABASE')),
//         entities: ['dist/src/**/**.entity{.ts,.js}'],
//         synchronize: Boolean(config.get('MYSQL_SYNCHRONIZE')),
//       });

//       // return targets[key];
//     },
//     set: function(value) {
//       console.log(`${propKey} 被设置为 ${value}`);
//       // this[propKey] = value;
//       // return true;
//     },
//   });

//   // targetProxy[propertyKey] = 'propertyKey';
// }
