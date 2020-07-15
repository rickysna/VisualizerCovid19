import Broadcast from "../libs/Broadcast";

export default abstract class BaseComponent<T> {
  events:Broadcast = new Broadcast();

  target: T;

  abstract init(...args: any[]): this;

  abstract setConfiguration(...args: any[]): this;

  abstract inject(...args: any[]): this;

  abstract setStyles(...args: any[]): this;

  abstract registerHooks(...args: any[]): this;
}
