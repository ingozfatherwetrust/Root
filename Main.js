"use strict";
exports.__esModule = true;
var readline = require("readline");
var lineReader = readline.createInterface({
    input: require('fs').createReadStream('./input.txt')
});
main();
function main() {
    var driversMap = new Map();
    lineReader.on('line', function (line) {
        var driver;
        var _a = line.split(" "), tripType = _a[0], name = _a[1], startTime = _a[2], endTime = _a[3], milesDriven = _a[4];
        // ensure that there's a listed driver before creating a
        if (tripType === 'Driver' && name) {
            driver = {
                name: name,
                totalMiles: 0,
                averageSpeed: 0,
                minutesDriven: 0
            };
            driversMap.set(driver.name, driver);
        }
        else if (tripType === 'Trip' && name && startTime && endTime && milesDriven) {
            var tripMinutes = getTotalMinutes(startTime, endTime);
            var averageSpeed = +milesDriven / (tripMinutes / 60);
            if (averageSpeed >= 5 && averageSpeed <= 100) {
                driver = driversMap.get(name);
                driver.minutesDriven += tripMinutes;
                driver.totalMiles += +milesDriven;
                driver.averageSpeed = driver.totalMiles / (driver.minutesDriven / 60);
                driversMap.set(driver.name, driver);
            }
        }
    });
    lineReader.on('close', function () {
        driversMap.forEach(function (driver, name) {
            var outputString;
            if (driver.totalMiles > 0) {
                outputString = name + ": " + driver.totalMiles + " miles " + driver.averageSpeed + " mph";
            }
            else {
                outputString = name + ": " + driver.totalMiles + " miles";
            }
            console.log(outputString);
        });
    });
}
function getTotalMinutes(startTime, endTime) {
    var _a = startTime.split(':').map(Number), startHours = _a[0], startMins = _a[1];
    var _b = endTime.split(':').map(Number), endHours = _b[0], endMins = _b[1];
    return (endHours * 60 + endMins) - (startHours * 60 + startMins);
}
