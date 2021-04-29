import React, { useState, useEffect, useRef } from "react";
// ! material UI imports
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Shape from "./Shape";
// ***************************************************************************
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 60,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  label: { fontSize: "20px", transform: "translateY(-10px)" },
  menuItem: { fontSize: "16px", border: "none" },
}));
// ***************************************************************************
function DropDown({ defaultNote, defaultFreq, position, makeChange }) {
  // ! for dropdown
  const classes = useStyles();
  // ! state for notes object
  const [note, setNote] = useState(defaultNote);
  const [freq, setFreq] = useState(defaultFreq);
  // ! Shape control
  const [shapeName, setShapeName] = useState("");
  const [shapeColor, setShapeColor] = useState("");
  const updateShape = (note) => {
    switch (note) {
      case "Do":
        setShapeName("square");
        setFreq("C1");
        makeChange(position, "C1");
        setShapeColor("blue");
        break;
      case "Re":
        setShapeName("circle");
        setFreq("Db3");
        makeChange(position, "Db3");
        setShapeColor("purple");
        break;
      case "Mi":
        setShapeName("square");
        setFreq("E1");
        makeChange(position, "E1");
        setShapeColor("yellow");
        break;
      case "Fa":
        setShapeName("triangle");
        setFreq("F#3");
        makeChange(position, "F#3");
        setShapeColor("green");
        break;
      case "So":
        setShapeName("circle");
        setFreq("G1");
        makeChange(position, "G1");
        setShapeColor("blue");
        break;
      case "La":
        setShapeName("triangle");
        setFreq("A2");
        makeChange(position, "A2");
        setShapeColor("red");
        break;
      case "Ti":
        setShapeName("square");
        setFreq("B2");
        makeChange(position, "B2");
        setShapeColor("green");
        break;

      default:
        break;
    }
  };
  const updateNote = (event) => {
    setNote(event.target.value);
    updateShape(event.target.value);
  };
  useEffect(() => {
    updateShape(defaultNote);
  }, []);
  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel
          shrink
          id="demo-simple-select-placeholder-label-label"
          className={classes.label}
        ></InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={note}
          onChange={updateNote}
          displayEmpty
          className={classes.menuItem}
        >
          <MenuItem value="Do" className={classes.menuItem}>
            Do
          </MenuItem>
          <MenuItem value="Re" className={classes.menuItem}>
            Re
          </MenuItem>
          <MenuItem value="Mi" className={classes.menuItem}>
            Mi
          </MenuItem>
          <MenuItem value="Fa" className={classes.menuItem}>
            Fa
          </MenuItem>
          <MenuItem value="So" className={classes.menuItem}>
            So
          </MenuItem>
          <MenuItem value="La" className={classes.menuItem}>
            La
          </MenuItem>
          <MenuItem value="Ti" className={classes.menuItem}>
            Ti
          </MenuItem>
        </Select>
      </FormControl>
      <Shape shapeName={shapeName} shapeColor={shapeColor} />
    </>
  );
}

export default DropDown;
