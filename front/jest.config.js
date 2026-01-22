module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  bail: false,
  verbose: false,
  collectCoverage: false,
  coverageDirectory: './coverage/jest',

  testPathIgnorePatterns: ['<rootDir>/node_modules/',
    '<rootDir>/src/app/features/auth/services/auth.service.ts',
    '<rootDir>/src/app/components/app.component.ts',
    '<rootDir>/src/app/components/app.component.spec.ts' 
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/app/features/auth/services/auth.service.ts',
    '<rootDir>/src/app/components/app.component.ts',
    '<rootDir>/src/app/components/app.component.spec.ts' 
  ],
  coverageThreshold: {
    global: {
      statements: 80
    },
  },
  roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules"
  ],
};
