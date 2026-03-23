const firebaseFunctionsMock = {
  https: {
    onRequest: jest.fn(),
  },
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
};

export = firebaseFunctionsMock;
