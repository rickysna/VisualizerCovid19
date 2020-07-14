import Broadcast from "../libs/Broadcast";
import { DataFieldsCo } from "../controllers/DataFields";

export interface BaseViewConstructor<View extends BaseView<any>> {
  new(elementId: string, data: DataFieldsCo): View
}

export default abstract class BaseView<Data> {
  private firstRender: boolean = true;

  public events: Broadcast = new Broadcast();

  viewNode: HTMLElement;

  constructor(public elementId: string, public data: Data) {
    this.viewNode = this.findDom();
    this.performRender();
  }

  private findDom() {
    const node = document.getElementById(this.elementId);

    if (!node) {
      throw new Error(`Can't find ${this.elementId} in dom`);
    }

    return node;
  }

  performRender(data?: any) {
    if (this.firstRender) {
      const template = this.render && this.render();
      if (typeof template === "string") {
        this.viewNode.innerHTML = template;
      }
    } else if (this.updateView) {
      this.updateView(data);
    }

    if (this.firstRender && this.registerHooks) this.registerHooks();

    if (this.firstRender && this.onViewReady) {
      this.onViewReady(this.events);
    }

    this.firstRender = false;
  }

  render?(): string;

  onViewReady?(events: Broadcast): void;

  updateView?(data?: any): void;

  registerHooks?(): void;

  // add method to erase instance and variables
}
