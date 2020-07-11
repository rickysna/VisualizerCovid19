import BaseView from "./BaseView";

export default class LoaderView extends BaseView<{}> {
  hide() {
    this.viewNode.style.opacity = "0";
    setTimeout(() => {
      this.viewNode.style.display = "none";
    }, 200);
  }

  display() {
    this.viewNode.style.display = "flex";
    setTimeout(() => {
      this.viewNode.style.opacity = "1";
    }, 200);
  }
}
