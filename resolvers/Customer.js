const resolvers = {
  Customer: {
    id(customer) {
      return customer._id;
    },

    channels(customer, { lastCreatedAt, limit }, { Customer }) {
      return Customer.channels(customer, { lastCreatedAt, limit });
    },
  },
  Query: {
    customers(root, { lastCreatedAt, limit }, { Customer }) {
      return Customer.all({ lastCreatedAt, limit });
    },

    customer(root, { id }, { Customer }) {
      return Customer.findOneById(id);
    },
  },
  Mutation: {
    async createCustomer(root, { input }, { Customer }) {
      const id = await Customer.insert(input);
      return Customer.findOneById(id);
    },

    async updateCustomer(root, { id, input }, { Customer }) {
      await Customer.updateById(id, input);
      return Customer.findOneById(id);
    },

    removeCustomer(root, { id }, { Customer }) {
      return Customer.removeById(id);
    },
  },
  Subscription: {
    customerCreated: customer => customer,
    customerUpdated: customer => customer,
    customerRemoved: id => id,
  },
};

export default resolvers;
