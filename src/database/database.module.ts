import { Module } from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';

export const MONGO_CLIENT = 'MONGO_CLIENT';
export const MONGO_DB = 'MONGO_DB';
export const USERS_COLLECTION = 'USERS_COLLECTION';
export const NOTIFICATIONS_COLLECTION = 'NOTIFICATIONS_COLLECTION';

@Module({
  providers: [
    {
      provide: MONGO_CLIENT,
      useFactory: async (): Promise<MongoClient> => {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
        const client = new MongoClient(uri);
        await client.connect();
        return client;
      },
    },
    {
      provide: MONGO_DB,
      useFactory: (client: MongoClient): Db => {
        const dbName = process.env.MONGO_DB_NAME || 'maquetado';
        return client.db(dbName);
      },
      inject: [MONGO_CLIENT],
    },
    {
      provide: USERS_COLLECTION,
      useFactory: (db: Db): Collection => db.collection('users'),
      inject: [MONGO_DB],
    },
    {
      provide: NOTIFICATIONS_COLLECTION,
      useFactory: (db: Db): Collection => db.collection('notifications'),
      inject: [MONGO_DB],
    },
  ],
  exports: [MONGO_CLIENT, MONGO_DB, USERS_COLLECTION, NOTIFICATIONS_COLLECTION],
})
export class DatabaseModule {}


