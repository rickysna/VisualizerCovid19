class Validator {
  static notNullValidatorMap: Map<Object, Map<string, number[]>> = new Map();

  static registerNotNull(target: Object, methodName: string, parameterIndex: number) {
    let paramMap: Map<string, number[]> = Validator.notNullValidatorMap.get(target);
    if (!paramMap) {
      paramMap = new Map();
      this.notNullValidatorMap.set(target, paramMap);
    }

    let parameterIndexes: number[] = paramMap.get(methodName);
    if (!parameterIndexes) {
      parameterIndexes = [];
      paramMap.set(methodName, parameterIndexes);
    }
    parameterIndexes.push(parameterIndex);
  }

  static performValidate(target: Object, methodName: string, paramValues: number[]):Boolean {
    const notNullValidatorMap = this.notNullValidatorMap.get(target);
    if (!notNullValidatorMap) {
      return true;
    }

    const paramIndexes: number[] = notNullValidatorMap.get(methodName);
    if (!paramIndexes) {
      return true;
    }

    let hasError:Boolean = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, paramValue] of paramValues.entries()) {
      if (paramIndexes.indexOf(index) !== -1) {
        if (!paramValue) {
          hasError = true;
          break;
        }
      }
    }

    return !hasError;
  }
}

export function required(target: Object, propertyKey: string, parameterIndex: number) {
  Validator.registerNotNull(target, propertyKey, parameterIndex);
}

export function validate(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const primitiveMethod = descriptor.value;

  descriptor.value = function invoke(...args: any[]) {
    if (Validator.performValidate(target, propertyKey, args)) {
      throw new Error("");
    }
    return primitiveMethod.apply(this, args);
  };
}

export function checkClassProps(...propertyNames: string[]) {
  return function callBack<TFunction extends Function>(target: TFunction): TFunction {
    const newConstructor: Function = function constructor(...args: any[]) {
      propertyNames.forEach((propertyKey) => {
        if (!this[propertyKey]) {
          throw new Error(`Controller's property ${propertyKey} is undefined`);
        }
      });
      return target.apply(this, args);
    };

    newConstructor.prototype = Object.create(target.prototype);
    newConstructor.prototype.constructor = target;
    return <TFunction>newConstructor;
  };
}
