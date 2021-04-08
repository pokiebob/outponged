import React, { Component } from "react";
import axios from "../../../../axios";

import Card from "../../../../components/Card/PersonCard";
import "./Players.css";
import { API_URL } from "../../../../api-url";

class Players extends Component {
  state = {
    players: [],
  };

  // getMockPlayers() {
  //   return PersonData.map((player, idx) => {
  //     return {
  //       ...player,
  //       pic: `https://randomuser.me/api/portraits/women/${idx}.jpg`,
  //       fullName: `${player.firstName} ${player.lastName}`,
  //     };
  //   });
  // }

  componentDidMount() {
    // For testing only
    // const players = this.getMockPlayers();
    // console.log(players);
    // this.setState({ players: players });

    axios
      .get(API_URL.person)
      .then((response) => {
        const players = response.data;
        const updatedPlayers = players.map((player, idx) => {
          return {
            ...player,
            
            fullName: `${player.firstName} ${player.lastName}`,
          };
        });
        this.setState({ players: updatedPlayers });
        // console.log( response );
      })
      .catch((error) => {
        console.error("[players] componentDidMount has error", error);
        // this.setState({error: true});
      });
  }

  playerSelectedHandler = (id) => {
    this.props.history.push({ pathname: "/person-profile/" + id });
    //    console.log("this.props.history: " + this.props.history);
    // this.props.history.push("//" + id);
  };

  render() {
    let players = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
    if (!this.state.error) {
      players = this.state.players.map((card) => {
        console.log(card);
        return (
          // <Link to={'/posts/' + post.id} key={post.id}>
          <Card
            key={card.personId}
            fullName={card.fullName}
            pic={card.pictureUrl}
            usattNumber={card.externalId.usattNumber}
            rating={card.rating}
            clicked={() => this.playerSelectedHandler(card.personId)}
          />
          // </Link>
        );
      });
    }

    return (
      <div>
        <section className="Players">{players}</section>
      </div>
    );
  }
}

export default Players;
