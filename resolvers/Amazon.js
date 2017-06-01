const resolvers = {
  Amazon: {
    id(amazon) {
      return amazon._id;
    },
  },
  Query: {
    amazons(root, { lastCreatedAt, limit }, { Amazon }) {
      return Amazon.all({ lastCreatedAt, limit });
    },

    amazon(root, { id }, { Amazon }) {
      return Amazon.findOneById(id);
    },
  },
  Mutation: {
    async createAmazon(root, { input }, { Amazon }) {
      const id = await Amazon.insert(input);
      return Amazon.findOneById(id);
    },

    async updateAmazon(root, { id, input }, { Amazon }) {
      await Amazon.updateById(id, input);
      return Amazon.findOneById(id);
    },

    removeAmazon(root, { id }, { Amazon }) {
      return Amazon.removeById(id);
    },
  },
  Subscription: {
    amazonCreated: amazon => amazon,
    amazonUpdated: amazon => amazon,
    amazonRemoved: id => id,
  },
};

export default resolvers;
