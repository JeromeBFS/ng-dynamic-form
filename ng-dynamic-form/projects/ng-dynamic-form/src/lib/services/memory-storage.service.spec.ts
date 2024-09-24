import {TestBed} from '@angular/core/testing';

import {MemoryStorageService} from './memory-storage.service';

describe('MemoryStorageService', () => {
	let service: MemoryStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [MemoryStorageService]
		});
		service = TestBed.inject(MemoryStorageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('setData', () => {
		it('should store data when called with a key', () => {
			// Act
			service.setData('SomeKey', 'SomeValue');

			// Arrange
			expect(service.getData<string>('SomeKey')).toBe('SomeValue');
		});
	});

	describe('getData', () => {
		it('should return data when called with a key', () => {
			// Arrange
			service.setData('SomeKey', 'SomeValue');

			// Act
			const value = service.getData<string>('SomeKey');

			// Assert
			expect(value).toBe('SomeValue');
		});

		it('should return undefined when key doesnt exists in data', () => {
			// Arrange
			service.setData('SomeKey', 'SomeValue');

			// Act
			const value = service.getData<string>('SomeUnknownKey');

			// Assert
			expect(value).toBeUndefined();
		});
	});

	describe('removeData', () => {
		it('should remove data when called', () => {
			// Arrange
			service.setData('SomeKey', 'SomeValue');
			let value = service.getData<string>('SomeKey');
			expect(value).toBe('SomeValue');

			// Act
			service.removeData('SomeKey');
			value = service.getData<string>('SomeKey');

			// Assert
			expect(value).toBeUndefined();
		});
	});

	describe('clearData', () => {
		it('should remove all entries when called', () => {
			// Arrange
			service.setData('SomeKey1', 'SomeValue1');
			service.setData('SomeKey2', 'SomeValue2');
			let value1 = service.getData<string>('SomeKey1');
			let value2 = service.getData<string>('SomeKey2');
			expect(value1).toBe('SomeValue1');
			expect(value2).toBe('SomeValue2');

			// Act
			service.clearData();
			value1 = service.getData<string>('SomeKey1');
			value2 = service.getData<string>('SomeKey2');

			// Assert
			expect(value1).toBeUndefined();
			expect(value2).toBeUndefined();
		});
	});
});
