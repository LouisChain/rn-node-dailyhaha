import {GIF_FETCHED, GIF_FETCHING, GIF_SEARCH_RESULT} from "../constants/action"
import {query, search} from "../utils/api"

function _fetching() {
  return {
    type: GIF_FETCHING,
    isFetching: true
  }
}

function _fetchPicture(payload) {
  return {
    type: GIF_FETCHED,
    gifList: payload.gifList,
    nextPage: payload.nextPage
  }
}

export function fetchPicture(page) {
  return dispatch => {
    dispatch(_fetching());
    query(page, "gif")
      .then(docs => {
        dispatch(_fetchPicture({
          gifList: docs.data.data,
          nextPage: page + 1
        }))
      })
  }
}

function _loadSearchResult(payload) {
  return {
    type: GIF_SEARCH_RESULT,
    gifList: payload.gifList
  }
}

export function searchPicture(page, q, tags) {
  let caption = null;
  if (q) {
    caption = q.trim();
  }
  return dispatch => {
    dispatch(_fetching());
    search(page, "gif", caption, tags)
      .then(docs => {
        dispatch(_loadSearchResult({
          gifList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  searchPage: 1,
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
      if (action.nextPage === 2) { // reset list when switching from search state to initial state
        state.gifList = [];
      }
      return {
        ...state,
        page: action.nextPage,
        isFetching: false,
        gifList: [...state.gifList, ...action.gifList]
      }
    case GIF_SEARCH_RESULT:
      // const reducedList = reduceLargeList(state.pictureList, action.pictureList, DIRECTION_DOWN);
      return {
        ...state,
        searchPage: state.searchPage + 1,
        isFetching: false,
        gifList: action.gifList
      }
    default:
      return state;
  }
}

export default gif;