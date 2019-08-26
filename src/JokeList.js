import React, { Component } from "react";
import Joke from "./Joke";
import axios from "axios";
import "./JokeList.css";
import uuid from "uuid";

class JokeList extends Component {
  static defaultProps = {
    numJokes: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      isLoading: true,
      isSorted: true,
      isViewingSaved: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.viewSavedJokes = this.viewSavedJokes.bind(this)

    this.seenJokes = new Set(this.state.jokes.map(j => j.text));
    this.savedJokes = [];
  }

  componentDidMount() {
    this.setState({ isLoading: false });
    // load jokes
    if (this.state.jokes.length <= 0) this.getJokes();
    console.log(this.seenJokes);
    this.sortJokes(this.state.jokes);

    this.savedJokes = this.state.jokes.filter(j => {
      return j.isSaved === true;
    });
    console.log(321);
  }

  async getJokes() {
    try {
      let newJokes = [];
      while (newJokes.length < this.props.numJokes) {
        this.setState({ isLoading: true });

        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        if (!this.seenJokes.has(res.data.joke)) {
          newJokes.push({
            id: uuid(),
            text: res.data.joke,
            votes: 0,
            isSaved: false
          });
        } else {
          console.log("we found a duplicate");
          console.log(res.data.joke);
        }
      }
      this.setState(
        st => ({
          jokes: [...st.jokes, ...newJokes],
          isLoading: false
        }),
        () => localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (exc) {
      console.log(exc);
      this.setState({ isLoading: false });
    }
  }

  handleClick() {
    this.setState({ isLoading: true }, () => this.getJokes());
  }

  sortJokes(jokes) {
    jokes = jokes.sort((a, b) => b.votes - a.votes);
    this.setState(st => ({ isSorted: !st.isSorted }));
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          id === j.id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      () => localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  async handleSave(id) {
    await this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          id === j.id ? { ...j, isSaved: !j.isSaved } : j
        )
      }),
      () => localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
    this.savedJokes = this.state.jokes.filter(j => {
      return j.isSaved === true;
    });
    console.log(this.savedJokes);
  }

  viewSavedJokes() {
    this.setState((st) => ({ isViewingSaved: !st.isViewingSaved }))
  }

  render() {
    let jokes = this.state.jokes;
    let savedJokes = this.savedJokes;

    if (this.state.isLoading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h3>Getting Jokes...</h3>
        </div>
      );
    } else {
      return (
        <div className="JokeList">
          <div className="JokeList-sidebar">
            <h1 className="JokeList-title">
              <span>DAD</span> Jokes
            </h1>

            <img
              src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
              alt=""
            />
            <button
              className="JokeList-getmore"
              onClick={() => this.handleClick()}
              disabled={this.state.isViewingSaved}
            >
              Get More Jokes
            </button>
            <button
              className="JokeList-getmore sort-btn"
              onClick={() => this.sortJokes(jokes)}
              disabled={this.state.isViewingSaved}

            >
              Sort
            </button>

            <button
              className="JokeList-getmore sort-btn"
              onClick={() => this.viewSavedJokes(jokes)}
            >
              {this.state.isViewingSaved ? "Back" : "View Saved Jokes"}
            </button>
          </div>

          <div className={`JokeList-jokes ${this.state.isViewingSaved ? "hidden" : ""}`}>

            {jokes.map(j => {
              return (
                <Joke
                  saveText={j.isSaved === true ? "Saved!" : "Save"}
                  isSaved={j.isSaved}
                  votes={j.votes}
                  text={j.text}
                  key={j.id}
                  upvote={() => this.handleVote(j.id, 1)}
                  downvote={() => this.handleVote(j.id, -1)}
                  saveJoke={() => this.handleSave(j.id)}
                />
              );
            })}
          </div>

          <div className={`JokeList-jokes ${!this.state.isViewingSaved ? "hidden" : ""}`}>

            {this.savedJokes.map(j => {
              return (
                <Joke
                  isSaved={j.isSaved}
                  saveText={""}
                  votes={j.votes}
                  text={j.text}
                  key={j.id}
                  upvote={() => this.handleVote(j.id, 1)}
                  downvote={() => this.handleVote(j.id, -1)}
                  saveJoke={() => this.handleSave(j.id)}
                />
              );
            })}
          </div>
        </div>
      );
    }
  }
}

export default JokeList;
