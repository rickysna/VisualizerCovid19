import BaseController, { BaseControllerConstructor } from "./controllers/BaseController";
import BaseView, { BaseViewConstructor } from "./views/BaseView";
import BaseModel, { BaseModelConstructor } from "./models/BaseModel";

export default class App {
  static controllers:BaseController<any, any, any>[] = [];

  static registerControllers<V extends BaseView<any>, M extends BaseModel<any>>(
    Controller: BaseControllerConstructor<M, V, any>,
    View: BaseViewConstructor<V>,
    Model: M | BaseModelConstructor<M, any>,
  ) {
    const controller = new Controller(Model, View);
    this.controllers.push(controller);
  }
}
