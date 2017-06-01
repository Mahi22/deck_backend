const resolvers = {
  Channel: {
    id(channel) {
      return channel._id;
    },
  },
  Query: {
    channels(root, { lastCreatedAt, limit }, { Channel }) {
      return Channel.all({ lastCreatedAt, limit });
    },

    channel(root, { id }, { Channel }) {
      return Channel.findOneById(id);
    },
  },
  Mutation: {
    async createChannel(root, { input }, { Channel }) {
      const id = await Channel.insert(input);
      return Channel.findOneById(id);
    },

    async updateChannel(root, { id, input }, { Channel }) {
      await Channel.updateById(id, input);
      return Channel.findOneById(id);
    },

    removeChannel(root, { id }, { Channel }) {
      return Channel.removeById(id);
    },
  },
  Subscription: {
    channelCreated: channel => channel,
    channelUpdated: channel => channel,
    channelRemoved: id => id,
  },
};

export default resolvers;
