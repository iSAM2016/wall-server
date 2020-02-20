const tasktime = {
  development: {
    nginx: '* */1 * * * *',
  },

  prod: {
    nginx: '*/4 * * * * *',
  },
};

export { tasktime };
