import { authResolvers } from './auth';
import { userResolvers } from './user';
import { productResolvers } from './product';
import { orderResolvers } from './order';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...productResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...productResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
  User: userResolvers.User,
  Order: orderResolvers.Order,
};

export default resolvers; 