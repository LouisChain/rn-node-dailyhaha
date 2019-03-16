import {GIF_FETCHED, GIF_FETCHING} from "../constants/action"
import {getGifs} from "../utils/api"

export function _fetching() {
  return {
    type: GIF_FETCHING,
    isFetching: true
  }
}

function _fetchPicture(payload) {
  return {
    type: GIF_FETCHED,
    gifList: payload.gifList
  }
}

export function fetchPicture(page) {
  return dispatch => {
    getGifs(page)
      .then(docs => {
        dispatch(_fetchPicture({
          gifList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  gifList: []
}

const gif = (state = initialState, action) => {
  switch (action.type) {
    case GIF_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching
      }
    case GIF_FETCHED:
      // const reducedList = reduceLargeList(state.gifList, action.gifList, DIRECTION_DOWN);
      return {
        ...state,
        page: state.page + 1,
        isFetching: false,
        gifList: [...state.gifList, ...action.gifList]
      }
    default:
      return state;
  }
}

export default gif;