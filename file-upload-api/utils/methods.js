//removeArrRegion method
//A method which removes all array items which have Region property = regionName and returns the new array.
//dataArray parameter must be an array of objects (in JSON) containing data extracted from the csv file.
//regionName parameter must be a string (e.g. "Europe") which specifies the region to be removed from data.
const removeArrRegion = (dataArray, regionName) => {
    const filteredArray = dataArray.filter((obj) => obj.Region !== regionName);
    return filteredArray;
};

//getRegionUnitsSold method
//A method which calculates the total units sold for each region and returns the results in an array of objects (e.g. [{Region: "Australia", "Units Sold": 1000} , {Region: "America", "Units Sold": 23044}]).
//dataArray parameter must be an array of objects (in JSON) containing data extracted from the csv file.
const getRegionUnitsSold = (dataArray) => {
    //sort the data alphabetically by region
    dataArray.sort((obj1, obj2) => {
        return obj1.Region.localeCompare(obj2.Region);
    });

    //The below reduce function iterates through the alphabetically sorted array and sums the total units sold for each region.
    //The region name of a current and before array item is checked every iteration to determine end-points for units sold summing
    const summarySoldUnitsArr = dataArray.reduce(
        (acc, arr) => {
            //check if region names are different.
            if (acc[acc.length - 1].Region !== arr.Region) {
                //reduce current object properties to Region and "Units Sold"
                arr = {
                    Region: arr.Region,
                    "Units Sold": arr["Units Sold"],
                };

                //push the current object data onto the accumulator array and return the result
                acc.push(arr);
                return acc;
            }

            //accumulate units sold sum for region
            acc[acc.length - 1]["Units Sold"] =
                parseInt(acc[acc.length - 1]["Units Sold"]) +
                parseInt(arr["Units Sold"]);

            return acc;
        },
        [{ Region: "", "Units Sold": 0 }]
    );

    //remove the inital accumlator value at beginning of array
    summarySoldUnitsArr.shift();

    return summarySoldUnitsArr;
};

module.exports = {
    getRegionUnitsSold,
    removeArrRegion,
};
