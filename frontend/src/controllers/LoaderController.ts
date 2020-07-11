import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import LoaderView from "../views/LoaderView";

export default class LoaderController extends BaseController<MapModel, LoaderView, {}> {
  get elementId() {
    return "loading";
  }

  onReady() {
    this.view.hide();
  }
}
