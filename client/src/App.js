import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, HttpLink } from "@apollo/client";
import React from 'react';


import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// ! help establish link from front to backend at graphql endpoint
const htppLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const client = new ApolloClient({
  link: HttpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    // wrapping jsx in apollo provider, allows access to api server
    <ApolloProvider client={client}>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
        <Home />
      </div>
      <Footer />
    </div>
    </ApolloProvider>
  );
}

export default App;
