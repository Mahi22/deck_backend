import { ObjectId } from 'mongodb';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { merge } from 'lodash';

const resolvers = {};

resolvers.ObjID = new GraphQLScalarType({
  name: 'ObjID',
  description: 'Id representation, based on Mongo Object Ids',
  parseValue(value) {
    return ObjectId(value);
  },
  serialize(value) {
    return value.toString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ObjectId(ast.value);
    }
    return null;
  },
});

export default resolvers;

import channelResolvers from './Channel';
merge(resolvers, channelResolvers);

import amazonResolvers from './Amazon';
merge(resolvers, amazonResolvers);

import flipkartResolvers from './Flipkart';
merge(resolvers, flipkartResolvers);

import customerResolvers from './Customer';
merge(resolvers, customerResolvers);

import userResolvers from './User';
merge(resolvers, userResolvers);
