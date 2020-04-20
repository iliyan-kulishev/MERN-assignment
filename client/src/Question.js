import React, { Component } from "react";
import PostAnswer from "./PostAnswer";

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleVote = this.handleVote.bind(this);
  }

  handleVote(event) {
    let answerId = event.currentTarget.dataset.id;
    this.props.handleVote(this.props.id, answerId);
  }

  render() {
    let title = " ";
    let listAnswers = "";
    const question = this.props.getQuestion(this.props.id);
    if (question) {
      title = question.text;
      if (question.answers) {
        listAnswers = question.answers.map((answer, id) => (
          <div key={answer._id} id={answer._id}>
            <div>
              <div>
                <div>
                  {answer.votes}
                </div>
                <button
                  onClick={() =>
                    this.props.handleVote(this.props.id, answer._id)
                  }
                >
                  vote
                </button>
              </div>
              <div>{answer.text}</div>
            </div>
          </div>
        ));
      }
    }
    return (
      <div>
        <div>
          <h2>Question</h2>
          <h4> {title}</h4>
        </div>
        <div>
          <h3>Answers</h3>
          <div>
            {listAnswers.length === 0 ? <p>No Answers!</p> : listAnswers}
          </div>

          <div>
            <PostAnswer
              qid={this.props.id}
              postAnswer={(questionId, text) =>
                this.props.postAnswer(questionId, text)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
