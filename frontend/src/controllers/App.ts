import Broadcast from "../libs/Broadcast";
import { required, validate } from "../libs/decorators";
import { Components } from "../models";

export default class App {
    static events:Broadcast = new Broadcast();

    static components:Components;

    @validate
    static onMapReady(@required components: Components) {
      if (components === undefined) {
        throw new Error("arguments is not fulfilled");
      }
      App.components = components;
      // App.components.loading.hide();

      document.getElementById("bottomBar")
        .addEventListener("click", () => {
          if (App.components.popup !== undefined) App.components.popup.show();
        }, false);
    }
}
