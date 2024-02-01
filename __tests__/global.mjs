global.addHandlerCallCount = 0;
global.addHandler = (type, handler) => {
  global.addHandlerCallCount++;
};
