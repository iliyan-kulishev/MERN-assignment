import React, { Component } from "react";

class PostAnswer extends Component {
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
    console.log(this.state.input);
    event.preventDefault();
    this.props.postAnswer(this.props.qid, this.state.input); 
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
                  Add answer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PostAnswer;
