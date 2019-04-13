const log = (tag = "DEV_MODE", message) => {
  if (__DEV__) {
    console.log(tag, message);
  }
}

const error = (tag = "DEV_MODE", message) => {
  if (__DEV__) {
    console.error(tag, message);
  }
}

export {log, error}