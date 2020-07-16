import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import LoaderView from "../views/LoaderView";
import {MapReady} from "../events";

export default class LoaderController extends BaseController<MapModel, LoaderView, {}> {
  get elementId() {
    return "loading";
  }

  registerHooks() {
    this.events.addEventListener(MapReady, () => this.view.hide());
  }
}
