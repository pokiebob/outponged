import React from "react";

import "./Card.css";

const card = (props) => (
  <article className="Card" onClick={props.clicked}>
    <h1>{props.title}</h1>
    <div className="Info">
      <img src={props.pic} />
      <div className="Author">{props.author}</div>
    </div>
  </article>
);

export default card;
