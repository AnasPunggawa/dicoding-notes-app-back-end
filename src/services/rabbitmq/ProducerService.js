const process = require('process');
const { Buffer } = require('node:buffer');
const amqp = require('amqplib');

const ProducerService = {
  /**
   * @param {string} queue
   * @param {string} message
   */
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(String(process.env.RABBITMQ_SERVER));
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
