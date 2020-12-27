import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./PersonProfile.css";

class PlayerPage extends Component {

  getPlayerId() {
    var location = this.props.location.pathname;
    return location.substring(9, location.length);
  }

  render() {
    console.log("player details");

    const imgSource = `https://randomuser.me/api/portraits/men/${this.getPlayerId()}.jpg`;

    return (
      <div>
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <img src={imgSource} style={{"border-radius": "50%"}}/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default PlayerPage;
