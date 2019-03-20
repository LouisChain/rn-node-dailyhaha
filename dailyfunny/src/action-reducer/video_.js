import {VIDEO_FETCHED, VIDEO_FETCHING} from "../constants/action"
import {getVideos} from "../utils/api"

function _fetching() {
  return {
    type: VIDEO_FETCHING,
    isFetching: true
  }
}

function _fetchVideo(payload) {
  return {
    type: VIDEO_FETCHED,
    videoList: payload.videoList
  }
}

export function fetchVideo(page) {
  return dispatch => {
    dispatch(_fetching());
    getVideos(page)
      .then(docs => {
        dispatch(_fetchVideo({
          videoList: docs.data.data
        }))
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
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
      return {
        ...state,
        page: state.page + 1,
        isFetching: false,
        videoList: [...state.videoList, ...action.videoList]
      }
    default:
      return state;
  }
}

export default video;