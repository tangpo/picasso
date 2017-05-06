
let tools = {

  getTime()
  {
    return (!performance || !performance.now) ? +new Date : performance.now();
  }

};

export default tools;