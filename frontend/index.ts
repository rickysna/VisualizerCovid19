import App from "./src/App";
import FooterController from "./src/controllers/FooterController";
import FooterView from "./src/views/FooterView";
import MapModel from "./src/models/MapModel";
import LoaderController from "./src/controllers/LoaderController";
import LoaderView from "./src/views/LoaderView";
import RankingController from "./src/controllers/RankingController";
import RankingView from "./src/views/RankingView";
import PopupController from "./src/controllers/PopupController";
import PopupView from "./src/views/PopupView";
import particles from "./src/libs/particles";

const mapModel = new MapModel();
App.registerControllers(FooterController, FooterView, mapModel);
App.registerControllers(LoaderController, LoaderView, mapModel);
App.registerControllers(RankingController, RankingView, mapModel);
App.registerControllers(PopupController, PopupView, mapModel);

particles("particles-js");
