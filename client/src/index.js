import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Grid from "@material-ui/core/Grid";

import Header from "./Header/header"
import Microphone from "./Microphone/Microphone";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Result from "./Result/Result";

import "./index.css";

function App() {
  const [file, setFile] = useState([null]);
  const [res, setRes] = useState(null);

  const pushFile = file => {
    setFile([file]);
  };

  const pushRes = res => {
    setRes(res);
  }

  return (
    <>
      <Header />
      <Microphone pushFile={pushFile} pushRes={pushRes} />
      <Grid container direction="column" spacing={3}>
        {file.map((file, index) => (
          <Grid key={index} item>
            <AudioPlayer file={file} />
          </Grid>
        ))}
      </Grid>
      {file.map((file, index) => (
        <Result res={res} />
      ))}

    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);
