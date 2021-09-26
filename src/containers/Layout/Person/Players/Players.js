import React, { Component } from "react";
import axios from "../../../../axios";
import Grid from "@material-ui/core/Grid";
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
      .get(API_URL.person + '?role=player')
      .then((response) => {
        const persons = response.data;
        const updatedPlayers = persons.map((player, idx) => {
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
        // console.log(card);
        return (
          <Grid container key={card.personId}>
            <Card
              fullName={card.fullName}
              pic={card.pictureUrl}
              usattNumber={card.externalId?.usattNumber}
              rating={card.rating}
              role={card.role}
              clicked={() => this.playerSelectedHandler(card.personId)}
            />
          </Grid>
        );
      });
    }

    return (
      <Grid container spacing={2} className="Players">
        <div style={{marginTop: 30}}>
          This is sample data...
        </div>
        {players}
      </Grid>
    );
  }
}

export default Players;
