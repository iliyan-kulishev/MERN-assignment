import React, { Component } from "react";

class AskQuestion extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      input: ""
    };
  }

  
  onChange(event) {
    this.setState({
      input: event.target.value
    });
  }

  
  onClick(event) {
    event.preventDefault();
    this.props.askQuestion(this.state.input); 
  }

  render() {
    return (
      <div>
        <div>
          <form>
            <div>
              <div>
                <input
                  onChange={event => this.onChange(event)}
                  type="text"
                />
              </div>
              <div>
                <button
                  type="submit"
                  onClick={event => this.onClick(event)}
                >
                  Ask question
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AskQuestion;
