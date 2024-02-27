import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Barcode from "react-jsbarcode";
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
} from "react-thermal-printer";
import JsBarcode from "jsbarcode";
import "./barcode.css";
const BarcodeComponent = ({ name, code, barCode }) => {
  // JsBarcode("#barcode", barCode,{
  //   format: "CODE128",
  //   lineColor: "#000",
  //   width:1.25,
  //   height:35,
  //   displayValue: false
  // });
  return (
    <>
      <Text size={{ width: 2, height: 2 }} style={{ fontSize: "12px" }}>
        {/* {name.split(" ")[0]} {name.split(" ")[1]} */}
        {name.slice(0, 21)}
        {name.length > 21 ? <>...</> : ""}
      </Text>
      <Box>
        <Printer width={100}>
          <Barcode
            className="barcode"
            options={{
              fontSize: 11,
              width: "2",
              height: "48",
              margin: 0,
              marginTop: undefined,
              marginBottom: undefined,
              marginLeft: undefined,
              marginRight: undefined,
              textPosition: "none",
              displayValue: false,
              padding: "2",
            }}
            format="CODE128"
            value={barCode}
            renderer="svg"
          />
        </Printer>
      </Box>
      <Text
        size={{ width: 2, height: 2 }}
        style={{ fontSize: "12px", marginTop: "-5px" }}
      >
        {code}
      </Text>
    </>
  );
};

export default BarcodeComponent;
