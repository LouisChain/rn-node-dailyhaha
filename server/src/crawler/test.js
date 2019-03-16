function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}

async function delayedLog(item) {
  // notice that we can await a function
  // that returns a promise
  await delay();
  console.log(item);
}
async function processArray(array) {
  // for(item of array) {
  //   await delayedLog(item)
  // }
  const promises = array.map(delayedLog)
  await Promise.all(promises);
  console.log('Done!');
}

processArray([1, 2, 3]);
