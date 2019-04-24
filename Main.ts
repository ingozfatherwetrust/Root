import * as fs from 'fs';
import * as readline from 'readline';

interface Driver {
    name: string;
    totalMiles: number;
    averageSpeed: number;
    minutesDriven: number;
}

let lineReader = readline.createInterface({
    input: require('fs').createReadStream('./input.txt')
});
main();

function main() {

    let driversMap = new Map();

    lineReader.on('line', (line: string) => {
        let driver: Driver;
        let [tripType, name, startTime, endTime, milesDriven] = line.split(" ");
        // ensure that there's a listed driver before creating a
        if(tripType === 'Driver' && name ) {
            driver = {
                name: name,
                totalMiles: 0,
                averageSpeed: 0,
                minutesDriven: 0
            };
            driversMap.set(driver.name, driver);
        } else if(tripType === 'Trip' && name && startTime && endTime && milesDriven) {
            let tripMinutes: number = getTotalMinutes(startTime, endTime);
            let averageSpeed: number =  +milesDriven / (tripMinutes / 60);
            if(averageSpeed >=  5 && averageSpeed <= 100) {
                driver = driversMap.get(name);
                driver.minutesDriven += tripMinutes;
                driver.totalMiles += +milesDriven;
                driver.averageSpeed = driver.totalMiles / (driver.minutesDriven / 60);
                driversMap.set(driver.name, driver);
            }
        }
    });
    lineReader.on('close', () => {
        driversMap.forEach((driver, name) => {
            let outputString;
            if(driver.totalMiles > 0) {
                outputString = `${name}: ${driver.totalMiles} miles ${driver.averageSpeed} mph`;

            } else {
                outputString = `${name}: ${driver.totalMiles} miles`;
            }
            console.log(outputString);
        })
    });
}

function getTotalMinutes(startTime, endTime) {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);
    return (endHours * 60 + endMins) - (startHours * 60 + startMins);
}
