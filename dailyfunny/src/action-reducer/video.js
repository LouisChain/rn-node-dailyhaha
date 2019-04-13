import {VIDEO_FETCHING, VIDEO_FETCHED, VIDEO_ERROR} from "../constants/action"
import {query, search} from "../utils/api"
import {getErrorMessage} from "../utils/errorUtils";
import * as Console from "../utils/logger";

const TABLE_NAME = "video"
const FETCHING = "VIDEO_FETCHING";
const FETCHED = "VIDEO_FETCHED";
const ERROR = "VIDEO_ERROR";

function _fetching() {
  return {
    type: FETCHING,
    isFetching: true
  }
}

function _error(payload) {
  return {
    type: ERROR,
    error: payload
  }
}

function _loadPicture(payload) {
  return {
    type: FETCHED,
    data: payload.data,
    resetData: payload.resetData
  }
}

export function loadPicture(page = 1, resetData = false) {
  return dispatch => {
    Console.log("loadPicture loading table=" + TABLE_NAME + " page=" + page);
    dispatch(_fetching());
    query(page, TABLE_NAME)
      .then(docs => {
        Console.log("loadPicture success table=" + TABLE_NAME + " page=" + page);
        dispatch(_loadPicture({
          data: docs.data.data,
          resetData
        }))
      })
      .catch(error => {
        Console.log("loadPicture error table=" + TABLE_NAME + " page=" + page);
        let message = getErrorMessage(error);
        dispatch(_error(message));
      })
  }
}

export function searchPicture(page = 1, query, tags, resetData = false) {
  let caption = null;
  if (query) {
    caption = query.trim();
  }
  return dispatch => {
    Console.log("searchPicture loading table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
    dispatch(_fetching());
    search(page, TABLE_NAME, caption, tags)
      .then(docs => {
        Console.log("searchPicture success table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
        dispatch(_loadPicture({
          data: docs.data.data,
          resetData
        }))
      })
      .catch(error => {
        Console.log("searchPicture error table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
        let message = getErrorMessage(error);
        dispatch(_error(message));
      })
  }
}

let initialState = {
  isFetching: false,
  error: null,
  page: 1,
  data: [],
  resetData: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        isFetching: true,
        error: null
      }
    case FETCHED:
      // const reducedList = reduceLargeList(state.pictureList, action.pictureList, DIRECTION_DOWN);
      if (action.resetData) {
        return {
          ...state,
          page: 2,
          resetData: false,
          isFetching: false,
          error: null,
          data: action.data
        }
      } else {
        return {
          ...state,
          page: state.page + 1,
          isFetching: false,
          error: null,
          data: [...state.data, ...action.data]
        }
      }
    case ERROR:
      return {
        ...state,
        error: action.error,
        isFetching: false
      }
    default:
      return state;
  }
}

export default reducer;