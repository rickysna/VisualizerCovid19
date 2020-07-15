import Broadcast from "../libs/Broadcast";
import DataFields from "../libs/DataFields";
import BaseModel, { BaseModelConstructor } from "../models/BaseModel";
import BaseView, { BaseViewConstructor } from "../views/BaseView";
import { checkClassProps } from "../libs/decorators";
import { ModelReady } from "../events";

export interface BaseControllerConstructor<
  Model extends BaseModel<any>,
  View extends BaseView<any>,
  Data,
> {
  new (): BaseController<Model, View, Data>
}

@checkClassProps("elementId")
abstract class BaseController
  <Model extends BaseModel<any>, View extends BaseView<any>, Data> {
  public model: Model;

  public view: View;

  public get immediateRender():boolean {
    return true;
  }

  public get elementId():string | undefined {
    return undefined;
  }

  public events: Broadcast = new Broadcast();

  public viewDataFields: DataFields<Data> = new DataFields();

  init(ModelClass: Model | BaseModelConstructor<any, Model>, ViewClass: BaseViewConstructor<View>) {
    if (ModelClass instanceof BaseModel) {
      this.model = ModelClass;
    } else {
      this.model = new ModelClass();
    }

    const data = this.viewDataFields.getAll();
    this.view = new ViewClass(this.elementId, data);

    if (this.immediateRender) {
      this.view.performRender();
    }

    this.initHooks();
  }

  onReady?(): void;

  registerHooks?(): void;

  initHooks() {
    this.events.addEventListener(
      ModelReady,
      () => this.onReady && this.onReady(),
      { refer: this.model },
    );

    if (this.registerHooks) this.registerHooks();
  }

  updateView(data?: any) {
    this.view.performRender(data);
  }

  // add method to erase instance and variables
}

export default BaseController;
