export interface CommondInterface {
  new (): CommonModuleInterface;
  signature(): string;
  description(): string;
}

export interface CommonModuleInterface {
  log(); // 打印日志
  execute(args, options);
}
