import { Box } from "@mui/material";
import "./barcode.css";

export const StudentCardCode = ({ amount, code, cardType = "Default" }) => {
  const color = "#fff";

  return (
    <div
      style={{
        direction: "rtl",
        backgroundImage: `url(/images/cards/${cardType}_front.png)`,
        display: "inline-block",
        width: "325px",
        height: "197px",
        overflow: "hidden",
        backgroundSize: "cover",
        color,
      }}
    >
      <p
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontSize: "1.25em",
          marginBottom: "20px",
          paddingTop: "5px",
          paddingInline: cardType === "Diamond" ? "8% 20%" : "20% 8%",
          ...(cardType === "Vip2" && {
            paddingInline: "8%",
            marginBottom: "5px",
            paddingTop: "20px",
          }),
        }}
      ></p>
      <div
        style={{
          marginTop: "14px",
          marginbottom: "20px",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          color: "#789dbd",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        <span>كارت فئة</span>
      </div>

      <div
        style={{
          display: "flex",
          paddingInline: "15px",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            textAlign: "center",
            justifyContent: "center",
            marginTop: "1%",
          }}
        >
          <p>
            <span style={{ fontSize: "40px" }}>{amount}</span>&nbsp;
            {/* <br /> */}
            <span style={{ fontSize: "20px" }}>جنيه</span>
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: "14px",
          marginbottom: "20px",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box className="barcode">{code}</Box>
      </div>
    </div>
  );
};
