import {VIDEO_FETCHED, VIDEO_FETCHING, VIDEO_SEARCH_RESULT} from "../constants/action"
import {query, search} from "../utils/api"

function _fetching() {
  return {
    type: VIDEO_FETCHING,
    isFetching: true
  }
}

function _fetchVideo(payload) {
  return {
    type: VIDEO_FETCHED,
    videoList: payload.videoList,
    nextPage: payload.nextPage
  }
}

export function fetchVideo(page) {
  return dispatch => {
    dispatch(_fetching());
    query(page, "video")
      .then(docs => {
        dispatch(_fetchVideo({
          videoList: docs.data.data,
          nextPage: page + 1
        }))
      })
  }
}

function _loadSearchResult(payload) {
  return {
    type: VIDEO_SEARCH_RESULT,
    videoList: payload.videoList
  }
}

export function searchPicture(page, q, tags) {
  let caption = null;
  if (q) {
    caption = q.trim();
  }
  return dispatch => {
    dispatch(_fetching());
    search(page, "video", caption, tags)
      .then(docs => {
        dispatch(_loadSearchResult({
          videoList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  searchPage: 1,
  videoList: []
}

const video = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_FETCHING:
      return {
        ...state,
        isFetching: true
      }
    case VIDEO_FETCHED:
      // const reducedList = reduceLargeList(state.videoList, action.videoList, DIRECTION_DOWN);
      if (action.nextPage === 2) { // reset list when switching from search state to initial state
        state.videoList = [];
      }
      return {
        ...state,
        page: action.nextPage,
        isFetching: false,
        videoList: [...state.videoList, ...action.videoList]
      }
    case VIDEO_SEARCH_RESULT:
      // const reducedList = reduceLargeList(state.pictureList, action.pictureList, DIRECTION_DOWN);
      return {
        ...state,
        searchPage: state.searchPage + 1,
        isFetching: false,
        videoList: action.videoList
      }
    default:
      return state;
  }
}

export default video;