import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { DataSet } from "./data";

function Field(props) {
  //console.log(props);
  var { label, value, editable, onChange, ...props } = props;
  //console.log(props);
  var readOnly = editable == undefined ? true : !editable;
  return (
    <li>
      <span>{label}</span>
      <span>
        <input
          onChange={onChange}
          type="text"
          value={value}
          readOnly={readOnly}
          {...props}
        />
      </span>
    </li>
  );
}

function VarienceField(props) {
  var v = props.value;
  return (
    <Field
      id="field-variance"
      label="Różnica"
      value={v}
      style={{ color: v >= 0 ? "green" : "red" }}
    />
  );
}

function Station(props) {
  var { station, onChange } = props;
  return (
    <div className={["details"]}>
      <ul>
        <Field label="Identyfikator:" value={station.name} />
        <Field label="Data pomiaru:" value={station.date} />
        <Field label="Wartośc oczekiwana:" value={station.expected} />
        <Field
          id="station-value"
          label="Zmierzona:"
          onChange={onChange}
          editable={true}
          value={station.value}
        />
        <VarienceField value={station.value - station.expected} />
      </ul>
    </div>
  );
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined
    };
  }

  selected(e) {
    //console.log("cos wybrane");
    //console.log(e.target.value);
    var id = e.target.value;
    var selected = undefined;
    for (var i in DataSet.stations) {
      var s = DataSet.stations[i];
      if (s.id === parseInt(id)) {
        selected = s;
        break;
      }
    }
    // WRONG: this.state.selected = selected;
    // console.log(selected);
    this.setState({
      selected: selected
    });
  }

  onChangeValue(e) {
    var v = e.target.value;
    console.log(v);
    this.setState(state => {
      state.selected.value = v;
      return state;
    });
  }

  // componentDidUpdate() {
  //   this.updateColor();
  // }

  // updateColor() {
  //   var field = document.getElementById("station-variance");
  //   var d = this.state.selected.value - this.state.selected.expected;
  //   // console.log(field);
  //   if (d >= 0) {
  //     field.style.color = "black";
  //   } else {
  //     field.style.color = "red";
  //   }
  // }

  render() {
    // console.log(this.state.selected);
    return (
      <div className="App">
        <div className="container">
          <h1>Pokaz kontroli stanu</h1>
          <div className="row">
            <div className="col-4">
              <select
                className="stations"
                multiple
                onChange={e => this.selected(e)}
              >
                {DataSet.stations.map((s, idx) => {
                  return (
                    <option key={idx} value={s.id} className="col-sm">
                      {s.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-4">
              {this.state.selected ? (
                <Station
                  onChange={e => {
                    this.onChangeValue(e);
                  }}
                  station={this.state.selected}
                />
              ) : (
                <div className="empty-box">Wybierz stację...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Form />, rootElement);
