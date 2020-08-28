import React, { Component } from "react";
import axios from "../../../../axios";
import { Route } from "react-router-dom";

import Card from "../../../../components/Card/Card";
import "./Players.css";
import PlayerPage from "./PlayerPage/PlayerPage";
import { PersonData } from "../PersonData";

class Posts extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    const players = PersonData.map((player, idx) => {
      return {
        ...player,
        pic: `https://randomuser.me/api/portraits/women/${idx}.jpg`,
        fullName: `${player.firstName} ${player.lastName}`,
      };
    });

    this.setState({ posts: players });
    // axios
    //   .get("/posts")
    //   .then((response) => {
    //     const posts = response.data.slice(0, 4);
    //     const updatedPosts = posts.map((post) => {
    //       return {
    //         ...post,
    //         author: "Mishu",
    //       };
    //     });
    //     this.setState({ posts: updatedPosts });
    //     // console.log( response );
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // this.setState({error: true});
    //   });
  }

  postSelectedHandler = (id) => {
    this.props.history.push({ pathname: "/players/" + id });
    //    console.log("this.props.history: " + this.props.history);
    // this.props.history.push("//" + id);
  };

  render() {
    let posts = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
    if (!this.state.error) {
      posts = this.state.posts.map((card) => {
        console.log(card);
        return (
          // <Link to={'/posts/' + post.id} key={post.id}>
          <Card
            key={card.personId}
            fullName={card.fullName}
            homeClub={card.homeClub}
            pic={card.pic}
            usattNumber={card.usattNumber}
            rating={card.rating}
            clicked={() => this.postSelectedHandler(card.personId)}
          />
          // </Link>
        );
      });
    }

    return (
      <div>
        <section className="Players">{posts}</section>
        <Route
          path={this.props.match.url + "/:id"}
          exact
          component={PlayerPage}
        />
      </div>
    );
  }
}

export default Posts;
