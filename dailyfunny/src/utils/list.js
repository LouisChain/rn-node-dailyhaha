import {DIRECTION_DOWN, DIRECTION_UP, MAXSIZE_LIST, REDUCE_SIZE} from "../constants/common";

export const reduceLargeList = (set1, set2, direction) => {
  if (direction === DIRECTION_UP) { //user scrolling up
    if (set1.length >= MAXSIZE_LIST) {
      let newSet = [...set2, ...set1.slice(0, REDUCE_SIZE)];
      return newSet;
    }else {
      return [...set2, ...set1];
    }
  } else if (direction === DIRECTION_DOWN) {//user scrolling down
    if (set1.length >= MAXSIZE_LIST) {
      let newSet = [...set1.slice(REDUCE_SIZE), ...set2];
      return newSet;
    }else {
      return [...set1, ...set2];
    }
  }
}