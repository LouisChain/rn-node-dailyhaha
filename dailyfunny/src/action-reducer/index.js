import {combineReducers} from "redux"
import picture from "./picture";
import gif from "./gif"
import game from "./game";
import video from "./video"

const rootReducer = combineReducers({
  picture,
  gif,
  game,
  video
});

export default rootReducer;