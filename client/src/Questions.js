import React, { Component } from "react";
import { Link } from "@reach/router";
import AskQuestion from "./AskQuestion";

class Questions extends Component {
  render() {
    let contentQuestions = <li>empty</li>;
    if (this.props.questions) {
      console.log("render again");
      contentQuestions = this.props.questions.map(question => (
        <div key={question._id}>
          <h3>
            <Link to={`/question/${question._id}`}>{question.text}</Link>
          </h3>
        </div>
      ));
    }
    return (
      <div>
        <div>
          <h1>Questions</h1>
        </div>
        <div>{contentQuestions}</div>
        <div>
          <AskQuestion askQuestion={text => this.props.askQuestion(text)} />
        </div>
      </div>
    );
  }
}

export default Questions;
