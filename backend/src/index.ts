import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import resolvers from './resolvers';
import { createContext } from './utils/context';
import cors from 'cors';

const typeDefs = readFileSync(join(__dirname, './schema/schema.graphql'), 'utf-8');

async function startServer() {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
    formatError: (error) => {
      // Remove the internal database error message
      if (error.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
      }

      // Return the original error
      return error;
    },
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false, // We already handled CORS
    path: '/graphql'
  });

  const PORT = 4000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
}); 