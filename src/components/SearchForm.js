import React, { Component } from 'react'
import {
  Card,
  Row,
  Col,
  CardBody,
  Form,
  Input,
  Button,
  InputGroupAddon,
  InputGroup,
} from 'reactstrap'

export default class SearchForm extends Component {
  render() {
    const {
      getSearchResults,
      inputChanged,
      s,
    } = this.props;
    return <Card className="bg-light">
      <CardBody>
        <Form onSubmit={getSearchResults}>
          <Row>
            <Col>
              <InputGroup>
                <Input type="search" id="search" name="s" value={s} onChange={inputChanged} placeholder="Search a Movie or TV Show Title" />
                <InputGroupAddon addonType="append"><Button color="primary">Search</Button></InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  }
}
