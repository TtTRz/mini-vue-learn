/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  preset: 'ts-jest',

  clearMocks: true,

  coverageDirectory: "coverage",
  coverageProvider: "v8",

  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],


  testMatch: ['<rootDir>/test/**/*.(spec|test).ts?(x)'],
  transform: {
    // // 将.js后缀的文件使用babel-jest处理
    // '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es|other-es-lib))'],

};
