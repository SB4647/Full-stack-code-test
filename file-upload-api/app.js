const express = require("express");
const cors = require("cors");
const multer = require("multer");
const CSVtoJSON = require("csvtojson");
const app = express();
app.use(cors());
const { getRegionUnitsSold, removeArrRegion } = require("./utils/methods");

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
        //remove all Europe region sale records using the removeArrRegion method implemented in methods.js
        const filteredArray = removeArrRegion(await jsonArray, "Europe");

        //get the total units sold for each region using the getRegionUnitsSold method implemented in methods.js
        const resultsArr = getRegionUnitsSold(await filteredArray);

        //send  200 ok status and the requested data back to client
        res.status(200).send(resultsArr);
    });
});

//make server listen on port 80000
app.listen(8000, () => {
    console.log("App running on port 8000");
});
