export class Popup {
    container: HTMLElement;
    wrapper: HTMLElement;
    closeButton: HTMLElement;
    constructor(elementId: string) {
        this.container = document.getElementById(elementId);
        this.closeButton = this.container.querySelector('[data-mark="close"]');
        this.wrapper = this.container.querySelector('.popup-wrapper')
        this.bindEvents();
    }
    show() {
        this.container.style.display = "block";
        setTimeout(() => this.container.style.opacity = "1", 200);
    }
    hide() {
        this.container.style.opacity = "0";
        setTimeout(() => this.container.style.display = "none", 200);
    }
    private bindEvents() {
        this.closeButton.addEventListener('click', () => this.hide(), false);
        this.container.addEventListener('mousedown', (ev) => {
            if (ev.target === this.container) this.hide();
        }, false);
    }
}