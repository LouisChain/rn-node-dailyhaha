import {PICTURE_FETCHED, PICTURE_FETCHING} from "../constants/action"
import {getPictures} from "../utils/api"

function _fetching() {
  return {
    type: PICTURE_FETCHING,
    isFetching: true
  }
}

function _loadPicture(payload) {
  return {
    type: PICTURE_FETCHED,
    pictureList: payload.pictureList
  }
}

export function loadPicture(page) {
  return dispatch => {
    dispatch(_fetching());
    getPictures(page)
      .then(docs => {
        dispatch(_loadPicture({
          pictureList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  pictureList: []
}

const picture = (state = initialState, action) => {
  switch (action.type) {
    case PICTURE_FETCHING:
      return {
        ...state,
        isFetching: true
      }
    case PICTURE_FETCHED:
      // const reducedList = reduceLargeList(state.pictureList, action.pictureList, DIRECTION_DOWN);
      return {
        ...state,
        page: state.page + 1,
        isFetching: false,
        pictureList: [...state.pictureList, ...action.pictureList]
      }
    default:
      return state;
  }
}

export default picture;