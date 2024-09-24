import { TestBed } from "@angular/core/testing";
import { ComponentProviderService } from "./component-provider.service";
import { DynamicFormComponentReference } from "../models/dynamic-form-component-reference";

describe("ComponentProviderService", () => {
  let service: ComponentProviderService;

  class FakeComponent {
  }

  class FakeOtherComponent {
  }

  class FakePropertyComponent {
  }

  class FakeOtherPropertyComponent {
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentProviderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("registerComponent", () => {
    it("should add component when not already exists", () => {
      // Arrange
      const component: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };

      // Act
      service.registerComponent(component);

      // Assert
      expect(service.components.length).toBe(1);
      expect(service.components).toContain(component);
      expect(service.getComponentById("c1")).toBe(component);
      expect(service.getComponentByType(FakeComponent)).toBe(component);
    });

    it("should throw error when component already exists with same id", () => {
      // Arrange
      const component1: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };

      const component2: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeOtherComponent,
        properties: [
          {
            propertyComponentType: FakeOtherPropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };
      service.registerComponent(component1);

      // Act
      const act = () => service.registerComponent(component2);

      // Assert
      expect(act).toThrowError(`A component with ID 'c1' has already been registered`);
    });
  });

  describe("getComponentByType", () => {
    it("should return undefined when no component has been registered", () => {
      // Act
      const component = service.getComponentByType(FakeComponent);

      // Assert
      expect(component).toBeUndefined();
    });

    it("should return undefined when no component has been registered", () => {
      // Arrange
      const component: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };
      service.registerComponent(component);

      // Act
      const foundComponent = service.getComponentByType(FakeOtherComponent);

      // Assert
      expect(foundComponent).toBeUndefined();
    });

    it("should return component when component has been registered", () => {
      // Arrange
      const component1: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };

      service.registerComponent(component1);
      const component2: DynamicFormComponentReference = {
        id: "c2",
        componentType: FakeOtherComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };
      service.registerComponent(component2);

      // Act
      const foundComponent1 = service.getComponentByType(FakeComponent);
      const foundComponent2 = service.getComponentByType(FakeOtherComponent);

      // Assert
      expect(foundComponent1).toBe(component1);
      expect(foundComponent2).toBe(component2);
    });
  });

  describe("getComponentById", () => {
    it("should return undefined when no component has been registered", () => {
      // Act
      const component = service.getComponentById("unknown");

      // Assert
      expect(component).toBeUndefined();
    });

    it(`should return undefined when component id doesn't exists`, () => {
      // Arrange
      const component: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };
      service.registerComponent(component);

      // Act
      const foundComponent = service.getComponentById("c2");

      // Assert
      expect(foundComponent).toBeUndefined();
    });

    it("should return component when component has been registered with specified id", () => {
      // Arrange
      const component1: DynamicFormComponentReference = {
        id: "c1",
        componentType: FakeComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };

      service.registerComponent(component1);
      const component2: DynamicFormComponentReference = {
        id: "c2",
        componentType: FakeOtherComponent,
        properties: [
          {
            propertyComponentType: FakePropertyComponent,
            label: { en: 'SomeLabel'}
          }
        ]
      };
      service.registerComponent(component2);

      // Act
      const foundComponent1 = service.getComponentById("c1");
      const foundComponent2 = service.getComponentById("c2");

      // Assert
      expect(foundComponent1).toBe(component1);
      expect(foundComponent2).toBe(component2);
    });
  });
});
