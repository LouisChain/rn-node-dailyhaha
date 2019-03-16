const retrieveHtml = url => {
  return fetch(url).then(response => response.text());
};

export { retrieveHtml };
