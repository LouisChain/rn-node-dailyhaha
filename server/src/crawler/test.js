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

// processArray([1, 2, 3]);

////////////////////
const shapes = ["diamond", "oval", "squiggle"];
const colors = ["green", "red", "purple"];
const fills = ["blank", "lined", "filled"];
const counts = [1, 2, 3];

function takeRandom(array) {
  let value = array[Math.floor(Math.random() * array.length)];
  return value;
}

function genCard() {
  let shape = takeRandom(shapes);
  let color = takeRandom(colors);
  let fill = takeRandom(fills);
  let count = takeRandom(counts);
  return {
    shape,
    color,
    fill,
    count
  }
}

function checkColor(c1, c2, c3) {
  let same = c1.color === c2.color && c2.color === c3.color && c1.color === c3.color;
  let diff = c1.color !== c2.color && c2.color !== c3.color && c1.color !== c3.color;
  if (same) return true
  else if (diff) return true;
  else return false;
}

function checkShape(c1, c2, c3) {
  let same = c1.shape === c2.shape && c2.shape === c3.shape && c1.shape === c3.shape;
  let diff = c1.shape !== c2.shape && c2.shape !== c3.shape && c1.shape !== c3.shape
  if (same) return true
  else if (diff) return true;
  else return false;
}

function checkFill(c1, c2, c3) {
  let same = c1.fill === c2.fill && c2.fill === c3.fill && c1.fill === c3.fill;
  let diff = c1.fill !== c2.fill && c2.fill !== c3.fill && c1.fill !== c3.fill;
  if (same) return true
  else if (diff) return true;
  else return false;
}

function checkCount(c1, c2, c3) {
  let same = c1.count === c2.count && c2.count === c3.count && c1.count === c3.count;
  let diff = c1.count !== c2.count && c2.count !== c3.count && c1.count !== c3.count;
  if (same) return true
  else if (diff) return true;
  else return false;
}

function isSet(set) {
  return checkColor(set.c1, set.c2, set.c3) && checkCount(set.c1, set.c2, set.c3)
    && checkShape(set.c1, set.c2, set.c3) && checkFill(set.c1, set.c2, set.c3);
}

const set1 = {
  c1: {
    shape: "diamond",
    color: "purple",
    fill: "lined",
    count: 1
  },
  c2: {
    shape: "oval",
    color: "green",
    fill: "blank",
    count: 2
  },
  c3: {
    shape: "squiggle",
    color: "green",
    fill: "filled",
    count: 2
  }
}

const set2 = {
  c1: {
    shape: "diamond",
    color: "red",
    fill: "lined",
    count: 1
  },
  c2: {
    shape: "oval",
    color: "green",
    fill: "blank",
    count: 2
  },
  c3: {
    shape: "squiggle",
    color: "red",
    fill: "filled",
    count: 3
  }
}

const set3 = {
  c1: {
    shape: "diamond",
    color: "purple",
    fill: "lined",
    count: 1
  },
  c2: {
    shape: "oval",
    color: "green",
    fill: "blank",
    count: 2
  },
  c3: {
    shape: "squiggle",
    color: "red",
    fill: "filled",
    count: 3
  }
}

const set4 = {
  c1: {
    shape: "oval",
    color: "red",
    fill: "blank",
    count: 1
  },
  c2: {
    shape: "oval",
    color: "red",
    fill: "blank",
    count: 2
  },
  c3: {
    shape: "oval",
    color: "red",
    fill: "blank",
    count: 3
  }
}


let setN = {
  c1: genCard(),
  c2: genCard(),
  c3: genCard()
}
console.log(setN);
let result = isSet(setN);
console.log(result);
