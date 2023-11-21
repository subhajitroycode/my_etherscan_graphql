// Import necessary Apollo Server and GraphQL modules
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");

// Import the custom data source
const EtherDataSource = require("./datasource/ethDatasource");

// Import the GraphQL schema
const typeDefs = importSchema("./schema.graphql");

// Load environment variables from .env file
require("dotenv").config();

// Define the resolvers
const resolvers = {
  Query: {
    // Resolver to get ether balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total ether supply
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver to get latest Ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver to get average block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    // Instantiate the custom data source
    ethDataSource: new EtherDataSource(),
  }),
});

// Set timeout to 0 (no timeout)
server.timeout = 0;

// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
