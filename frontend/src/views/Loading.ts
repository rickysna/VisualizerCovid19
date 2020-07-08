export default class Loading {
  dom: HTMLElement;

  constructor(public elementId: string) {
    this.dom = document.getElementById(this.elementId);
  }

  hide() {
    this.dom.style.opacity = "0";
    setTimeout(() => {
      this.dom.style.display = "none";
    }, 200);
  }

  display() {
    this.dom.style.display = "flex";
    setTimeout(() => {
      this.dom.style.opacity = "1";
    }, 200);
  }
}
