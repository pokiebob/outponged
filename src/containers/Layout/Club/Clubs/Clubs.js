import React, { Component } from "react";
import axios from "../../../../axios";

import Card from "../../../../components/Card/ClubCard";
import "./Clubs.css";

class Clubs extends Component {
  state = {
    clubs: [],
  };


  componentDidMount() {

    axios
      .get("http://localhost:8080/club")
      .then((response) => {
        const clubs = response.data;
        const updatedClubs = clubs.map((club, idx) => {
          return {
            ...club,
          };
        });
        this.setState({ clubs: updatedClubs });
        // console.log( response );
      })
      .catch((error) => {
        console.error("[Clubs] componentDidMount has error", error);
        // this.setState({error: true});
      });
  }

  clubSelectedHandler = (id) => {
    this.props.history.push({ pathname: "/profile/" + id });
    //    console.log("this.props.history: " + this.props.history);
    // this.props.history.push("//" + id);
  };

  render() {
    let clubs = <p style={{ textAlign: "center" }}>Something went wrong!</p>;
    if (!this.state.error) {
      clubs = this.state.clubs.map((card) => {
        console.log(card);
        return (
          // <Link to={'/posts/' + post.id} key={post.id}>
          <Card
            key={card.clubId}
            name={card.name}
            address={card.address}
            pic={card.pictureUrl}
            siteUrl={card.siteUrl}
            phoneNumber={card.phoneNumber}
            clicked={() => this.clubSelectedHandler(card.personId)}
          />
          // </Link>
        );
      });
    }

    return (
      <div>
        <section className="Clubs">{clubs}</section>
      </div>
    );
  }
}

export default Clubs;
