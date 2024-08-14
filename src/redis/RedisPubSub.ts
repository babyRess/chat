// src/redis/RedisPubSub.ts
import { createClient, RedisClientType } from 'redis';

export default class RedisPubSub {
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private channels: Set<string> = new Set();
  private handlers: { [channel: string]: (message: string) => void } = {};

  constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
    this.subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
    this.publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
  }

  public async connect() {
    try {
      await this.subscriber.connect();
      await this.publisher.connect();
      this.channels.forEach((channel) => this.subscriber.subscribe(channel, (message) => this.handleMessage(channel, message)));
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }

  public async publish(channel: string, message: string) {
    try {
      await this.publisher.publish(channel, message);
    } catch (err) {
      console.error('Error publishing message:', err);
    }
  }

  public async subscribe(channel: string, handler: (message: string) => void) {
    this.channels.add(channel);
    this.handlers[channel] = handler;
    if (this.subscriber.isReady) {
      await this.subscriber.subscribe(channel, (message) => this.handleMessage(channel, message));
    }
  }

  private handleMessage(channel: string, message: string) {
    if (this.handlers[channel]) {
      this.handlers[channel](message);
    }
  }
}
