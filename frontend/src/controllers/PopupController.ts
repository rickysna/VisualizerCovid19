import BaseController from "./BaseController";
import MapModel from "../models/MapModel";
import PopupView from "../views/PopupView";

export default class PopupController extends BaseController<MapModel, PopupView, {}> {
  get elementId() {
    return "popup";
  }
}
