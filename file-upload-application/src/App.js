import { Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import axios from "axios";
import Chart from "react-google-charts";

function App() {
    //set states for the uploaded file data and the calculated results from back-end.
    const [file, setFile] = useState(null);
    const [fileResults, setFileResults] = useState([]);

    //chart settings used for google charts
    const chartSettings = {
        width: 400,
        height: 300,
        options: {
            legend: { position: "none" },
            hAxis: {
                title: "Region",
                minValue: 0,
                slantedText: "true",
            },
            vAxis: {
                title: "Total Units Sold",
            },
            chartArea: {
                top: 20,
                height: "70%",
            },
        },
        data: [["Region", "Units Sold"]].concat(
            fileResults.map((result) => [result.Region, result["Units Sold"]])
        ),
    };

    //function which triggers when a file is uploaded to form input. Sets state to the file data.
    const handleOnChange = (event) => {
        setFile(event.target.files[0]);
    };

    //fuction which triggers when submit is clicked (after file is uploaded)
    const handleSubmit = async (event) => {
        //prevent form from redirecting
        event.preventDefault();

        //create FormData instance and append the file to be uploaded/sent
        const data = new FormData();
        data.append("file", file);

        //send csv file to server and wait for response
        const response = await axios.post("http://localhost:8000/upload", data);

        //get the calculated results data from response
        const results = await response.data;

        //set fileResults state to the results data and reset file state
        setFileResults(results);
        setFile(null);
    };

    return (
        <div className="App">
            <Container className="d-flex vh-100 flex-column align-items-center p-3">
                <div className="text-center border border-primary rounded p-3 mb-3">
                    <h6 className="text-uppercase">File Upload</h6>
                    <p className="text-justify" style={{ fontSize: "0.8rem" }}>
                        Upload the "100 Sales Records.csv" file below to display
                        a column graph showing the total units sold for each
                        region.
                    </p>
                    <Form className="text-center m-2" onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Control
                                size="sm"
                                className="text-center"
                                type="file"
                                onChange={handleOnChange}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!file}
                            size="sm"
                        >
                            Submit
                        </Button>
                    </Form>
                </div>
                {/* Column graph showing results data. Only displayed when results return from server */}
                {fileResults.length != 0 ? (
                    <div className="text-center">
                        <h4>Total Units Sold for Different Regions</h4>
                        <div className="text-center -flex flex-column align-items-center pl-5 m-0">
                            <Chart
                                chartType="ColumnChart"
                                width={chartSettings.width}
                                height={chartSettings.height}
                                loader={<div>Loading Chart</div>}
                                data={chartSettings.data}
                                options={chartSettings.options}
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </Container>
        </div>
    );
}

export default App;
