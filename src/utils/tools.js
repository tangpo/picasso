
let tools = {

  getTime()
  {
    return (!performance || !performance.now) ? +new Date : performance.now();
  }

};

module.exports = tools;