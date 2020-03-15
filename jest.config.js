module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      /* 컴파일 시 에러가 있을 경우 무시하지 않고 테스트에 실패하게 하는 옵션 기본값이 false */
      enableTsDiagnostics: true
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node",
  modulePathIgnorePatterns: ["./test/db.test.ts"]
};
