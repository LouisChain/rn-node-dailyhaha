import {GAME_FETCHED, GAME_FETCHING} from "../constants/action"
import {query} from "../utils/api"

export function _fetching() {
  return {
    type: GAME_FETCHING,
    isFetching: true
  }
}

function _fetchGame(payload) {
  return {
    type: GAME_FETCHED,
    gameList: payload.gameList
  }
}

export function fetchGame(page) {
  return dispatch => {
    query(page, "game")
      .then(docs => {
        dispatch(_fetchGame({
          gameList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  gameList: []
}

const game = (state = initialState, action) => {
  switch (action.type) {
    case GAME_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching
      }
    case GAME_FETCHED:
      // const reducedList = reduceLargeList(state.gameList, action.gameList, DIRECTION_DOWN);
      return {
        ...state,
        page: state.page + 1,
        isFetching: false,
        gameList: [...state.gameList, ...action.gameList]
      }
    default:
      return state;
  }
}

export default game;