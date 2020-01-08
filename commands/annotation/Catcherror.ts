export const Catcherror = () => {
  return (target, propetyKey, descriptor) => {
    let oldMethod = descriptor.value;
    descriptor.value = function() {
      return oldMethod.apply(this, arguments).catch(e => {
        console.log('命令行错误了');
        this.alert.sendMessage(
          String(this.config.get('ALERT_WATCH_UCID_LIST')),
          e.stack,
        );
        this.log('catch error');
        this.log(e.stack);
      });
    };
  };
};
