import React from "react";

type QAProps = {
  question: string;
  answer: string;
};

const QA = (props: QAProps) => (
  <>
    Q:{" "}
    <span
      className="cool-text"
      dangerouslySetInnerHTML={{ __html: props.question }}
    ></span>
    <br />
    A: <span dangerouslySetInnerHTML={{ __html: props.answer }}></span>
    <br /> <br />
  </>
);

export default QA;
