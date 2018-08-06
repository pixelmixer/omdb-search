import React, { Component } from 'react'
import './App.css'

import OMDB from './services/OMDB'
import queryString from 'query-string'

import {
  Container,
  Col,
  Card,
  CardBody,
  Button,
  CardColumns,
} from 'reactstrap';
import Spinner from 'react-spinkit';
import Result from './components/Result';
import SearchForm from './components/SearchForm';

const defaultState = {
  Search: [],
  totalResults: 0,
  Response: null,
  page: 1,
  s: '',
}

const Loading = () =>
  <span className="d-flex justify-content-center">
    <Spinner name="three-bounce"></Spinner>
  </span>

class App extends Component {
  constructor() {
    super();

    this.state = defaultState;

    this.getSearchResults = this.getSearchResults.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.showMore = this.showMore.bind(this);
    this.stateUpdated = this.stateUpdated.bind(this);

    window.addEventListener('popstate', this.stateUpdated);
  }

  // Update the app if page state changes. This allows the app to trigger a search when the query string exists in the url and enables things like back button functionality.
  stateUpdated() {
    const { s } = queryString.parse(document.location.search);
    this.setState({ ...defaultState });
    if (s) {
      this.setState({ s });
      this.submitSearch(s)
    }
  }

  componentDidMount() {
    // When the component is mounted trigger the state update. We can gather the query string here.
    this.stateUpdated()
  }

  // Button event nested in SearchForm component to perform the search. This also adds the search term to a query string in the location bar and enables back and forward browser capabilities with pushState.
  getSearchResults(event) {
    const { s } = this.state;
    const targetUrl = new URL(window.location.href);
    targetUrl.search = `?s=${s}`;
    window.history.pushState({ path: targetUrl.href }, '', targetUrl.href);

    event.preventDefault();
    this.submitSearch(s);
  }

  // Increments the page number and resubmits the search.
  showMore() {
    const { s, page } = this.state;
    this.submitSearch(s, page + 1);
  }

  // Let's just keep track of the search field state.
  // We could live without this, but it could be useful later for validation or autocomplete if needed.
  inputChanged({ target: { name, value }}) {
    this.setState({ [name]: value });
  }

  // Run the search with term and page and tell the app that we're now searching.
  async submitSearch(s, page = 1) {
    this.setState({ s, Response: 'Loading' });
    const result = await OMDB.search(s, page);

    if( result.Response === 'False' && result.Error ) {
      this.setState({ ...defaultState, s, ...result });
    }

    // If we're not paging then just set the state to the current result.
    // If we are paging then let's append the current and previous search results.
    if (page <= 1) {
      return this.setState({ ...result })
    } else {
      const { Search } = this.state;
      const results = { ...result };
      results.Search = [...Search, ...results.Search];
      return this.setState({ ...results, page })
    }
  }

  // Render the search results or Error messages.
  renderResults() {
    const { Search, Response, totalResults, Error } = this.state;

    if (Response === 'False' && Error) {
      return <Col>{Error}</Col>;
    } else if (Response === 'True' && Search.length <= 0) {
      return <Col>No Results Found</Col>
    }

    // Throw the results in a CardColumns wrapper because it has an interesting tiled layout.
    return <CardColumns>{Search.map(result => <Result key={result.imdbID} {...{ ...result, Response, totalResults }} />)}</CardColumns>;
  }

  render() {
    const {
      state: {
        Response,
        page,
        totalResults = 0,
        s,
      },
      renderResults,
      getSearchResults,
      inputChanged,
      showMore,
    } = this;

    return (
      <div className="Avoxi">
        <Container className={`pt-4 pl-1 pr-1 d-flex justify-content-center flex-column ${!Response ? 'h-v100' : ''}`}>
          <div className={`mb-2 w-100 Avoxi--sticky-search ${!Response ? 'h-v75' : ''}`}>
            <div>
              <h4 className="text-light font-weight-light pl-2">OMDB Search</h4>
              <SearchForm {...{s, inputChanged, getSearchResults}}/>
            </div>
          </div>
          {Response !== null &&
            <div className="w-100">
              <Card>
                <CardBody>
                  {Response === 'Loading' ? <Loading /> : renderResults()}
                  {(page * 10 < totalResults && Response !== 'False' && Response !== 'Loading') ? <Button block color="primary" onClick={showMore}>Show More</Button> : ''}
                </CardBody>
              </Card>
            </div>}
          </Container>
        </div>
    );
  }
}

export default App;
