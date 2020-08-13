import Broadcast from "../libs/Broadcast";
import { ModelReady } from "../events";

export function preRequest(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const primitive = descriptor.value;
  descriptor.value = async function invoke(...args: any[]) {
    if (this.data === undefined) {
      this.data = await this.fetchData();
    }
    primitive.apply(this, args);
  };
}

export interface BaseModelConstructor<Model extends BaseModel<DataType>, DataType> {
  new (): Model
}

abstract class BaseModel<DataType> {
  events: Broadcast;

  data: DataType;

  constructor() {
    this.events = new Broadcast();

    this.registerHooks();

    if (this.fetchData) {
      this.fetchData().then((result) => {
        this.data = result;
      }).then(() => this.modelReady());
    } else {
      this.modelReady();
    }
  }

  fetchData?(): Promise<DataType>

  abstract registerHooks(): void;

  modelReady() {
    this.events.triggerEvent(ModelReady, {
      refer: this,
    });
  }
}

export default BaseModel;
