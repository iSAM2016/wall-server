import { DotenvConfigOptions } from 'dotenv';

export interface EnvConfig {
  [key: string]: any;
}
// ？ 是可选参数
// 定义对象
export interface ConfigOptions extends Partial<DotenvConfigOptions> {
  replaceConfigName?: (name: string) => string;
}
// 接口定义函数validateInput
export interface EnvValidator {
  validateInput(envConfig: EnvConfig): EnvConfig;
}

// interface ISearchFunc {
//     (source : string, substring : string):boolean;
//     };

//      let  searchfunc : ISearchFunc;
//      searchfunc = function (source : string, substring : string) {
//      return source.search(substring) != -1;
//      };
//      console.log(searchfunc("2334455",'45'));

//  //具有索引签名。 这个索引签名表示了当用 number去索引StringArray时会得到string类型的返回值。
//  interface StingInterface {
//     [index : number] : string;
//     }
//     let myArray : StingInterface;
//     myArray = ["sddad","45455"];
//     let mystr = myArray[0];

//     //TypeScript支持两种索引签名：字符串和数字
//     // 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
//     class Animal {
//     name : string;
//     }

//     class  Dog extends Animal{
//     age : string;
//     }
//     //同时使用number返回类型是string返回类型的子类
//     interface NotOkay {
//     [index : string] : Animal;
//     [index : number] : Dog;
//     }

let a: ConfigOptions = {
  replaceConfigName: (name: string): string => {
    return name;
  },
};

let b: EnvValidator = {
  validateInput: ({ name: string }: EnvConfig) => ({ name: '123' }),
};
