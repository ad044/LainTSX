import React from "react";

type CreditProps = {
  name: string;
  credit: string;
};

const Credit = (props: CreditProps) => (
  <>
    <span className="cool-text">{props.name}</span> - {props.credit}
    <br />
    <br />
  </>
);

export default Credit;
