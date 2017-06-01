const models = {};

export default function addModelsToContext(context) {
  const newContext = Object.assign({}, context);
  Object.keys(models).forEach((key) => {
    newContext[key] = new models[key](newContext);
  });
  return newContext;
}

import Channel from './Channel';
models.Channel = Channel;

import Amazon from './Amazon';
models.Amazon = Amazon;

import Flipkart from './Flipkart';
models.Flipkart = Flipkart;

import Customer from './Customer';
models.Customer = Customer;

import User from './User';
models.User = User;
