const resolvers = {
  Flipkart: {
    id(flipkart) {
      return flipkart._id;
    },
  },
  Query: {
    flipkarts(root, { lastCreatedAt, limit }, { Flipkart }) {
      return Flipkart.all({ lastCreatedAt, limit });
    },

    flipkart(root, { id }, { Flipkart }) {
      return Flipkart.findOneById(id);
    },
  },
  Mutation: {
    async createFlipkart(root, { input }, { Flipkart }) {
      const id = await Flipkart.insert(input);
      return Flipkart.findOneById(id);
    },

    async updateFlipkart(root, { id, input }, { Flipkart }) {
      await Flipkart.updateById(id, input);
      return Flipkart.findOneById(id);
    },

    removeFlipkart(root, { id }, { Flipkart }) {
      return Flipkart.removeById(id);
    },
  },
  Subscription: {
    flipkartCreated: flipkart => flipkart,
    flipkartUpdated: flipkart => flipkart,
    flipkartRemoved: id => id,
  },
};

export default resolvers;
