import React, { Component } from 'react'
import {
  Card,
  Row,
  Col,
  CardImgOverlay,
  CardImg,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap'
import { PLACEHOLDER_IMAGE } from '../constants/constants'
import { decorateActorNames } from '../helpers/helpers'
import OMDB from '../services/OMDB';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetails: false,
      details: {}
    }

    this.openDetails = this.openDetails.bind(this);
  }

  // Get the movie/show details.
  async openDetails() {
    const {
      props: { imdbID },
      state: { showDetails }
    } = this;

    const details = await OMDB.getDetails(imdbID);

    this.setState({
      showDetails: !showDetails,
      details
    });
  }

  render() {
    const {
      props: {
        Poster = '',
        Title = '',
        Year = '',
        Response = '',
        Error,
      },
      state: {
        showDetails,
        details: {
          Plot = '',
          Actors = '',
          Released = '',
          Runtime = '',
        } = {}
      },
      openDetails,
    } = this;

    return <Row className="pb-2">
      <Col xs="12">
      {
        Response === 'False' ?
        <Col>{Error}</Col>
        :
        <Card inverse onClick={openDetails} className="Avoxi--moviecard">
          <CardImg width="100%" style={{'objectFit': 'contain'}} src={Poster !== 'N/A' ? Poster : PLACEHOLDER_IMAGE} alt={Title} />
          <CardImgOverlay className="Avoxi--moviecard__overlay">
          <div>
            <Row><Col>{Title}</Col></Row>
            <Row><Col>{Year}</Col></Row>
          </div>
          </CardImgOverlay>
        </Card>
      }
      </Col>
      <Modal isOpen={showDetails} toggle={openDetails} size={"lg"} centered={true}>
        <ModalHeader toggle={openDetails}>{Title}</ModalHeader>
        <ModalBody>
          <Row>
            <Col><strong>Released</strong>: {Released}</Col>
            <Col className="text-right"><strong>Runtime</strong>: {Runtime}</Col>
          </Row>
          <hr/>
          {Actors && Actors.length ? <Row>
            <Col><strong>Actors</strong>:<br /> {decorateActorNames(Actors)}</Col>
          </Row> : ''}
          <hr/>
          <Row>
            <Col><p>{Plot}</p></Col>
          </Row>
        </ModalBody>
      </Modal>
    </Row>
  }
}
