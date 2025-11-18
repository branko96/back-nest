import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Server } from 'http';

let cachedServer: Server;

export default async function handler(req, res) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
      credentials: true,
    });

    await app.init();
    const express = app.getHttpAdapter().getInstance();
    cachedServer = express;
  }

  return cachedServer(req, res);
}