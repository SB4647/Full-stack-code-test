const express = require("express");
const cors = require("cors");
const multer = require("multer");
const CSVtoJSON = require("csvtojson");
const app = express();
app.use(cors());

//Create a multer instance which specifies the save location and name of the csv file received.
const storage = multer.diskStorage({
    //store file in the public folder.
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    //keep the file name same as orginal
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//create a upload instance which receives a single file
const upload = multer({ storage: storage }).single("file");

//Upload route used to detect csv file sent from client
app.post("/upload", (req, res) => {
    //upload the csv file using the upload instance
    upload(req, res, async (err) => {
        const fileName = req.file.filename;

        //check for multer instance error and then for any general errors. Send 500 status back to client if true.
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }

        //read saved csv file and store in JSON array
        const jsonArray = await CSVtoJSON().fromFile(`./public/${fileName}`);
        //remove all Europe region sale records
        const filteredArray = await jsonArray.filter(
            (obj) => obj.Region !== "Europe"
        );

        //sort the data alphabetically by region
        filteredArray.sort((obj1, obj2) => {
            return obj1.Region.localeCompare(obj2.Region);
        });

        //function which iterates through alphabetically sorted array and sums the total units sold for each region.
        //continously compares the region name of a current and before item to determine end-points for units sold summing
        const summarySoldUnitsArr = filteredArray.reduce(
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

        //send  200 ok status and the requested data back to client
        res.status(200).send(summarySoldUnitsArr);
    });
});

//make server listen on port 80000
app.listen(8000, () => {
    console.log("App running on port 8000");
});
