import {combineReducers} from "redux"
import picture from "./picture";
import gif from "./gif"
import game from "./game";

const rootReducer = combineReducers({
  picture,
  gif,
  game
});

export default rootReducer;