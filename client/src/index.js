import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Header from "./Header/header"
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Result from "./Result/Result";

import "./index.css";

function App() {
  const [res, setRes] = useState(null);

  const pushRes = res => {
    setRes(res);
  }

  return (
    <>
      <Header />
      <AudioPlayer pushRes={pushRes} />
      <Result res={res} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);
