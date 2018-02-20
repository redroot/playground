import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import './App.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache()
});

const allItemsQuery = gql`
query AllItemsQuery {
  allItems {
    id,
    url,
    link
  }
}
`;

const ItemsList = ({ data: { allItems, loading }}) => {
  if (loading) {
    return <div>Loading...</div>
  } else {
    return (
      <ul>
        {allItems.map((item) => <li key={item.id}><a href={item.url}>{item.link}</a></li>)}
      </ul>
    )
  }
}

const ItemsListWithQuery = graphql(allItemsQuery)(ItemsList);


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to The Place</h1>
          </header>
          <ItemsListWithQuery />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
