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
