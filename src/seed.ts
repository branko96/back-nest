import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

async function runSeed() {
  dotenv.config();

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGO_DB_NAME || 'maquetado';

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const email = 'test@example.com';
    const password = 'password123';

    const existing = await users.findOne({ email });
    if (existing) {
      // eslint-disable-next-line no-console
      console.log('Usuario ya existe, no se crea de nuevo');
      return;
    }

    const result = await users.insertOne({
      email,
      password,
      name: 'Usuario de prueba',
    });

    // eslint-disable-next-line no-console
    console.log('Usuario creado con id:', result.insertedId.toString());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error en seed:', err);
  } finally {
    await client.close();
  }
}

runSeed();


