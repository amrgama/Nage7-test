import Barcode from "react-jsbarcode";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { useState } from "react";
import { Box } from "@mui/material";
import "./barcode.css";
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
} from "react-thermal-printer";

export const StudentCardFront = ({ student, group, cardType = "Default" }) => {
  console.log("StudentCardFront===>", student);
  const color = cardType === "Gold" ? "#deb61f" : "#fff";
  const fallback = `/images/cards/${student.gender}_STUDENT.png`;

  console.log("StudentCardFront===>", student);

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
      >
        <bdi>
          {student.name.slice(0, 21)}
          {student.name.length > 21 ? <>...</> : ""}
        </bdi>
        {/* {student.name.split(" ")[0]} {student.name.split(" ")[1] }  {student.name.split(" ")[2] } */}
      </p>
      <div
        style={{
          display: "flex",
          paddingInline: "15px",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          src={student.image ?? fallback}
          alt=""
          width="80px"
          height="80px"
          onError={() => {
            if (image !== fallback) setImage(fallback);
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <p style={{ display: "flex", gap: "10px" }}>
            <span>الكود :</span>
            <span>{student.code}</span>
          </p>
          <p style={{ display: "flex", gap: "10px" }}>
            {/* <span>المجموعة :</span> */}
            <span>
              {/* {group.name} */}
              {group.name.slice(0, 21)}
              {group.name.length > 21 ? <>...</> : ""}
            </span>
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: "10px",
          marginBottom: "20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Printer width={100}>
          <Box className="barcode">
            <Barcode
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
              }}
              format="CODE128"
              value={student.barCode}
              renderer="svg"
            />
          </Box>
        </Printer>
      </div>
    </div>
  );
};

export const StudentCardBack = ({ cardType = "Default", teacher }) => {
  const color = cardType === "Gold" ? "#deb61f" : "#fff";
  return (
    <div
      style={{
        direction: "rtl",
        backgroundImage: `url(/images/cards/${cardType}_back.png)`,
        width: "325px",
        height: "197px",
        overflow: "hidden",
        backgroundSize: "cover",
        color,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: ["Diamond", "Vip1"].includes(cardType)
          ? "flex-end"
          : cardType === "Gold"
          ? "space-evenly"
          : "center",
        alignItems: ["Gold", "Default"].includes(cardType)
          ? "flex-end"
          : "center",
        paddingInline: "5px",
        position: "relative",
        ...(cardType !== "Vip2" && {
          paddingBottom: "5px",
        }),
      }}
    >
      <bdi
        style={{
          textAlign: "center",
          fontSize: "1.2em",
          marginBottom: "5px",
          display: "block",
          paddingInline: "11%",
          ...(cardType === "Default" && {
            // paddingInline: "0 40%",
            paddingBottom: "20px",
            textAlign: "start",
          }),
          ...(cardType === "Gold" &&
            {
              // paddingInline: "0 30%",
            }),
        }}
      >
        {teacher.name.split(" ")[0]} {teacher.name.split(" ")[1]}
      </bdi>
      <bdi
        style={{
          display: "flex",
          flexDirection: ["Gold", "Default"].includes(cardType)
            ? "column"
            : "row",
          alignItems: "center",
          gap: "7px",
          paddingInlineStart: "20px",
          ...(cardType === "Default" && {
            position: "absolute",
            right: "13%",
            top: "49%",
          }),
        }}
      >
        <span
          style={{
            display: "inline-flex",
            gap: "5px",
            alignItems: "center",
            fontSize: "1em",
          }}
        >
          <LocalPhoneRoundedIcon
            style={{
              borderRadius: "50%",
              border: "2px solid",
              borderColor: color,
              padding: "3px",
              fontSize: "1em",
            }}
          />
          {teacher.phone}
        </span>
        <span
          style={{
            display: "inline-flex",
            gap: "5px",
            alignItems: "center",
            fontSize: "1em",
          }}
        >
          <LocalPhoneRoundedIcon
            style={{
              borderRadius: "50%",
              border: "2px solid",
              borderColor: color,
              padding: "3px",
              fontSize: "1em",
            }}
          />
          {teacher.phone2}
        </span>
      </bdi>
    </div>
  );
};
