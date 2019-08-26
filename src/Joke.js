import React, { Component } from "react";
import "./Joke.css";

class Joke extends Component {
  getColour() {
    if (this.props.votes >= 15) {
      return "green";
    } else if (this.props.votes >= 10) {
      return "lightgreen";
    } else if (this.props.votes >= 5) {
      return "yellow";
    } else if (this.props.votes >= 2) {
      return "orange";
    } else if (this.props.votes <= 0) {
      return "red";
    }
  }

  getEmoji() {
    if (this.props.votes >= 15) {
      return `em em-rolling_on_the_floor_laughing`;
    } else if (this.props.votes >= 10) {
      return `em em-laughing`;
    } else if (this.props.votes >= 5) {
      return `em em-smiley`;
    } else if (this.props.votes >= 2) {
      return `em em-smile`;
    } else if (this.props.votes >= 0) {
      return `em em-face_with_rolling_eyes`;
    } else {
      return `em em-angry`;
    }
  }
  render() {
    return (
      <div className="Joke">
        {this.props.saveText ? <div className="Joke-buttons">
          <button className="Joke-saveBtn" onClick={this.props.saveJoke}>
            {this.props.saveText}
          </button>

          <i className="fas fa-arrow-up" onClick={this.props.upvote} />
          <span
            className="Joke-votes"
            style={{ border: `3px solid ${this.getColour()}` }}
          >
            {this.props.votes}
          </span>
          <i className="fas fa-arrow-down" onClick={this.props.downvote} />
        </div> : ""}


        <div className="Joke-text">{this.props.text}</div>

        {this.props.saveText ? <div className="Joke-smiley">
          <i className={`${this.getEmoji()} Joke-smiley`} />
        </div> : ""}

      </div>
    );
  }
}

export default Joke;
