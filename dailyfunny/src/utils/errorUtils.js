const getErrorMessage = (error) => {
  let message = error.message.toLowerCase();
  let errorMessage = "";
  if (message.includes("timeout")) {
    errorMessage = "Something went wrong, please trying to refresh."
  } else if (message.includes("network error")) {
    errorMessage = "No internet connection."
  } else {
    errorMessage = "Unknown error."
  }
  return errorMessage;
}

export { getErrorMessage }