function calculateAndStoreDelays(events) {
    let arr = new Array(53).fill(null);

    const charCodeA = 'A'.charCodeAt(0);
    const charCodea = 'a'.charCodeAt(0);

    let delays = {};
    let x = null; // To store the current mean
    let y = null; // To store the current standard deviation

    events.forEach(event => {
        if (!delays[event.key]) {
            delays[event.key] = { down: [], up: [] };
        }
        if (event.event === 'keydown') {
            delays[event.key].down.push(event.timestamp);
        } else if (event.event === 'keyup') {
            delays[event.key].up.push(event.timestamp);
        }
    });

    for (let key in delays) {
        let downTimes = delays[key].down;
        let upTimes = delays[key].up;

        let keyDelays = [];
        downTimes.forEach((downTime, index) => {
            if (upTimes[index]) {
                keyDelays.push(upTimes[index] - downTime);
            }
        });

        if (keyDelays.length > 0) {
            let index;
            if (key === ' ') {
                index = 52; // space character index
            } else if (key >= 'a' && key <= 'z') {
                index = key.charCodeAt(0) - charCodea;
            } else if (key >= 'A' && key <= 'Z') {
                index = 26 + (key.charCodeAt(0) - charCodeA);
            }

            if (index !== undefined) {
                let n = 0; // Number of values processed for this key
                let sum = 0; // Running sum of delays
                let mean = 0; // Running mean
                let varianceSum = 0; // Running sum of squared differences for variance

                // Process each delay value for the key
                keyDelays.forEach((delay) => {
                    n++;
                    let oldMean = mean;
                    mean = mean + (delay - mean) / n;
                    varianceSum += (delay - oldMean) * (delay - mean);
                    let stdDev = Math.sqrt(varianceSum / n);

                    // For the first event, initialize x and y (mean and stdDev) in arr[index]
                    if (n === 1) {
                        x = mean;
                        y = stdDev;
                        arr[index] = [mean, stdDev];
                    } else {
                        if (mean <= 3 * x && stdDev <= 15 * y) {
                            x = mean;
                            y = stdDev;
                            arr[index] = [mean, stdDev];
                        }

                    }
                    // console.log(arr[index]);
                });
            }
        }
    }

    return arr;
}


function calculateAndStoreInterkeyDelays(events) {
    const size = 53;
    let arr = Array.from({ length: size }, () => Array.from({ length: size }, () => [null, null, null, null]));

    const charCodeA = 'A'.charCodeAt(0);
    const charCodea = 'a'.charCodeAt(0);

    let downDelays = {};
    let upDelays = {};
    let prevDownKey = null;
    let prevUpKey = null;
    let prevDownTime = null;
    let prevUpTime = null;

    let uMeanDown = 0;
    let uStdDevDown = 0;
    let uMeanUp = 0;
    let uStdDevUp = 0;

    events.forEach(event => {
        let index;
        if (event.key === ' ') {
            index = 52; // space character index
        } else if (event.key >= 'a' && event.key <= 'z') {
            index = event.key.charCodeAt(0) - charCodea;
        } else if (event.key >= 'A' && event.key <= 'Z') {
            index = 26 + (event.key.charCodeAt(0) - charCodeA);
        }

        if (index !== undefined) {
            if (event.event === 'keydown') {
                if (prevDownKey !== null) {
                    let delay = event.timestamp - prevDownTime;
                    let keyPair = `${prevDownKey},${index}`;
                    if (!downDelays[keyPair]) { //only for 1st
                        downDelays[keyPair] = { n: 0, mean: 0, varianceSum: 0 };
                    }
                    let stats = downDelays[keyPair];
                    stats.n++;
                    let oldMean = stats.mean;
                    stats.mean += (delay - stats.mean) / stats.n;
                    stats.varianceSum += (delay - oldMean) * (delay - stats.mean);
                    let stdDev = Math.sqrt(stats.varianceSum / stats.n);

                    if (uMeanDown === 0 && uStdDevDown === 0) {
                        uMeanDown = stats.mean;
                        uStdDevDown = stdDev;
                        arr[prevDownKey][index][0] = stats.mean;
                        arr[prevDownKey][index][1] = stdDev;
                    } else {
                        if (stats.mean <= 3 * uMeanDown && stdDev <= 15 * uStdDevDown) {
                            uMeanDown = stats.mean;
                            uStdDevDown = stdDev;
                            arr[prevDownKey][index][0] = stats.mean;
                            arr[prevDownKey][index][1] = stdDev;
                        }
                    }


                }
                prevDownKey = index;
                prevDownTime = event.timestamp;
            } else if (event.event === 'keyup') {
                if (prevUpKey !== null) {
                    let delay = event.timestamp - prevUpTime;
                    let keyPair = `${prevUpKey},${index}`;
                    if (!upDelays[keyPair]) {
                        upDelays[keyPair] = { n: 0, mean: 0, varianceSum: 0 };
                    }
                    let stats = upDelays[keyPair];
                    stats.n++;
                    let oldMean = stats.mean;
                    stats.mean += (delay - stats.mean) / stats.n;
                    stats.varianceSum += (delay - oldMean) * (delay - stats.mean);
                    let stdDev = Math.sqrt(stats.varianceSum / stats.n);

                    if (uMeanUp === 0 && uStdDevUp === 0) {
                        uMeanUp = stats.mean;
                        uStdDevUp = stdDev;
                        arr[prevUpKey][index][2] = stats.mean;
                        arr[prevUpKey][index][3] = stdDev;
                    } else {
                        if (stats.mean <= 3 * uMeanUp && stdDev <= 15 * uStdDevUp) {
                            uMeanUp = stats.mean;
                            uStdDevUp = stdDev;
                            arr[prevUpKey][index][2] = stats.mean;
                            arr[prevUpKey][index][3] = stdDev;
                        }
                    }
                }
                prevUpKey = index;
                prevUpTime = event.timestamp;
            }
        }
    });

    return arr;
}


function processEventsWithSlidingWindow(events, windowSize, slideSize) {
    const results = [];
    let start = 0;

    while (start < events.length) {
        let end = Math.min(start + windowSize, events.length);
        let windowEvents = events.slice(start, end);

        let keyDelaysResult = calculateAndStoreDelays(windowEvents);
        let interkeyDelaysResult = calculateAndStoreInterkeyDelays(windowEvents);

        results.push({
            keyDelays: keyDelaysResult,
            interkeyDelays: interkeyDelaysResult,
        });

        start += slideSize;
    }

    return results;
}
