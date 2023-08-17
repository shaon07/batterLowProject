import "bootstrap/dist/css/bootstrap.min.css";
import Papa from "papaparse";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import "./App.css";
import TableData from "./components/table";

const tempInputClass = "mb-3 d-flex flex-column align-items-start";
const allowedExtensions = ["csv"];

function App() {
  const [formStepLevel, setFormStepLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mainData, setMainData] = useState([]);

  const [formState, setFormState] = useState({
    projectName: "",
    projectDescription: "",
    client: "",
    contractor: "",
    max_X: -Infinity,
    min_X: Infinity,
    max_Y: -Infinity,
    min_Y: Infinity,
    max_Z: -Infinity,
    min_Z: Infinity,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formStepLevel === 1) {
      setFormStepLevel(2);
    } else {
      setMainData([...mainData, formState]);
      setFormStepLevel(1);
      setFormState({
        projectName: "",
        projectDescription: "",
        client: "",
        contractor: "",
        max_X: -Infinity,
        min_X: Infinity,
        max_Y: -Infinity,
        min_Y: Infinity,
        max_Z: -Infinity,
        min_Z: Infinity,
      })
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    try {
      setError("");
      setLoading(true);
      // Check if user has entered the file
      if (e.target.files.length) {
        const inputFile = e.target.files[0];

        // Check the file extensions, if it not
        // included in the allowed extensions
        // we show the error
        const fileExtension = inputFile?.type.split("/")[1];
        if (!allowedExtensions.includes(fileExtension)) {
          setError("Please input a csv file");
          return;
        }

        // If input type is correct set the state
        setTimeout(() => {
          handleParse(inputFile);
        }, 1000);
      }
    } catch (error) {
      setError("There is an error");
    } finally {
      setLoading(false);
    }
  };

  const handleParse = (data) => {
    // If user clicks the parse button without
    // a file we show a error
    if (!data) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;

      let maxX = parsedData[0].X;
      let minX = parsedData[0].X;
      let maxY = parsedData[0].Y;
      let minY = parsedData[0].Y;
      let maxZ = parsedData[0].Z;
      let minZ = parsedData[0].Z;

      for (let i = 1; i < parsedData.length; i++) {
        const obj = parsedData[i];

        // Update maxX and minX
        if (obj.X > maxX) {
          maxX = obj.X;
        }
        if (obj.X < minX) {
          minX = obj.X;
        }

        // Update maxY and minY
        if (obj.Y > maxY) {
          maxY = obj.Y;
        }
        if (obj.Y < minY) {
          minY = obj.Y;
        }

        // Update maxZ and minZ
        if (obj.Z > maxZ) {
          maxZ = obj.Z;
        }
        if (obj.Z < minZ) {
          minZ = obj.Z;
        }
      }

      setFormState({
        ...formState,
        max_X: maxX,
        min_X: minX,
        max_Y: maxY,
        min_Y: minY,
        max_Z: maxZ,
        min_Z: minZ,
      });

    };
    reader.readAsText(data);
  };


  return (
    <Container className="App">
      <Card className="p-3 m-3">
        <div>
          <h1>MD Shamirul Islam Corp</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className={`${tempInputClass}`}>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              name="projectName"
              value={formState.projectName}
              onChange={handleChange}
              type="text"
              placeholder="Enter Project Name"
              required
              disabled={formStepLevel !== 1}
            />
          </Form.Group>

          <Form.Group className={`${tempInputClass}`}>
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              name="projectDescription"
              type="text"
              placeholder="Enter Project Description"
              value={formState.projectDescription}
              onChange={handleChange}
              required
              disabled={formStepLevel !== 1}
            />
          </Form.Group>

          <Form.Group className={`${tempInputClass}`}>
            <Form.Label>Client</Form.Label>
            <Form.Control
              name="client"
              type="text"
              placeholder="Enter Client"
              value={formState.client}
              onChange={handleChange}
              required
              disabled={formStepLevel !== 1}
            />
          </Form.Group>

          <Form.Group className={`${tempInputClass}`}>
            <Form.Label>Contractor</Form.Label>
            <Form.Control
              name="contractor"
              type="text"
              placeholder="Enter Contractor"
              value={formState.contractor}
              onChange={handleChange}
              required
              disabled={formStepLevel !== 1}
            />
          </Form.Group>

          {formStepLevel === 2 && <hr />}

          {formStepLevel === 2 && (
            <>
              <Form.Group className={`${tempInputClass}`}>
                <Form.Label>Upload CSV</Form.Label>
                <Form.Control
                  name="csvFile"
                  type="file"
                  placeholder="Enter Contractor"
                  // value={csvFile}
                  onChange={handleFileChange}
                />
              </Form.Group>
              {loading && <small> "Uploading..."</small>}
              {error && <small> {error}</small>}
            </>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MAX_X</Form.Label>
              <Form.Control
                name="max_X"
                type="number"
                placeholder="Enter MAX_X"
                value={formState.max_X || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MIN_X</Form.Label>
              <Form.Control
                name="min_X"
                type="number"
                placeholder="Enter MIN_X"
                value={formState.min_X || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MAX_Y</Form.Label>
              <Form.Control
                name="max_Y"
                type="number"
                placeholder="Enter MAX_Y"
                value={formState.max_Y || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MIN_Y</Form.Label>
              <Form.Control
                name="min_Y"
                type="number"
                placeholder="Enter MIN_Y"
                value={formState.min_Y || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MAX_Z</Form.Label>
              <Form.Control
                name="max_Z"
                type="number"
                placeholder="Enter MAX_Z"
                value={formState.max_Z || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          {formStepLevel === 2 && (
            <Form.Group className={`${tempInputClass}`}>
              <Form.Label>MIN_Z</Form.Label>
              <Form.Control
                name="min_Z"
                type="number"
                placeholder="Enter MIN_Z"
                value={formState.min_Z || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit">
            {formStepLevel === 1 ? "Next" : "Submit"}
          </Button>
        </Form>
      </Card>

      <Card className="p-3 m-3">
        <TableData data={mainData} />
      </Card>
    </Container>
  );
}

export default App;
