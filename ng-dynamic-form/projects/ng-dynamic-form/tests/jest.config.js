'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/ng-dynamic-form/tests/setupJest.ts'],
	//coverageDirectory: '<rootDir>/coverage/sonarQube',
	//testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true
};
