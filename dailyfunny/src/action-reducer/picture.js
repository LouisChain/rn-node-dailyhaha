import {PICTURE_FETCHING, PICTURE_FETCHED, PICTURE_ERROR} from "../constants/action"
import {query, search} from "../utils/api"
import {getErrorMessage} from "../utils/errorUtils";
import * as Console from "../utils/logger";

const TABLE_NAME = "picture"
const FETCHING = PICTURE_FETCHING;
const FETCHED = PICTURE_FETCHED;
const ERROR = PICTURE_ERROR;

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

function _fetched(payload) {
  return {
    type: FETCHED,
    data: payload.data,
    resetData: payload.resetData
  }
}

export function fetchData(page = 1, resetData = false) {
  return dispatch => {
    Console.log("fetchData loading table=" + TABLE_NAME + " page=" + page);
    dispatch(_fetching());
    query(page, TABLE_NAME)
      .then(docs => {
        Console.log("fetchData success table=" + TABLE_NAME + " page=" + page);
        dispatch(_fetched({
          data: docs.data.data,
          resetData
        }))
      })
      .catch(error => {
        Console.log("fetchData error table=" + TABLE_NAME + " page=" + page);
        let message = getErrorMessage(error);
        dispatch(_error(message));
      })
  }
}

export function searchData(page = 1, query, tags, resetData = false) {
  let caption = null;
  if (query) {
    caption = query.trim();
  }
  return dispatch => {
    Console.log("searchData loading table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
    dispatch(_fetching());
    search(page, TABLE_NAME, caption, tags)
      .then(docs => {
        Console.log("searchData success table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
        dispatch(_fetched({
          data: docs.data.data,
          resetData
        }))
      })
      .catch(error => {
        Console.log("searchData error table=" + TABLE_NAME + " page=" + page + " query=" + query + " tags=" + tags);
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