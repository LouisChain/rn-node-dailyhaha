import {PICTURE_FETCHED, PICTURE_FETCHING, PICTURE_SEARCH_RESULT} from "../constants/action"
import {query, search} from "../utils/api"

function _fetching() {
  return {
    type: PICTURE_FETCHING,
    isFetching: true
  }
}

function _loadPicture(payload) {
  return {
    type: PICTURE_FETCHED,
    pictureList: payload.pictureList,
    nextPage: payload.nextPage
  }
}

export function loadPicture(page) {
  return dispatch => {
    dispatch(_fetching());
    query(page, "picture")
      .then(docs => {
        dispatch(_loadPicture({
          pictureList: docs.data.data,
          nextPage: page + 1
        }))
      })
  }
}

function _loadSearchResult(payload) {
  return {
    type: PICTURE_SEARCH_RESULT,
    pictureList: payload.pictureList
  }
}

export function searchPicture(page, q, tags) {
  let caption = null;
  if (q) {
    caption = q.trim();
  }
  return dispatch => {
    dispatch(_fetching());
    search(page, "picture", caption, tags)
      .then(docs => {
        dispatch(_loadSearchResult({
          pictureList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  searchPage: 1,
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
      if (action.nextPage === 2) { // reset list when switching from search state to initial state
        state.pictureList = [];
      }
      return {
        ...state,
        page: action.nextPage,
        isFetching: false,
        pictureList: [...state.pictureList, ...action.pictureList]
      }
    case PICTURE_SEARCH_RESULT:
      // const reducedList = reduceLargeList(state.pictureList, action.pictureList, DIRECTION_DOWN);
      return {
        ...state,
        searchPage: state.searchPage + 1,
        isFetching: false,
        pictureList: action.pictureList
      }
    default:
      return state;
  }
}

export default picture;