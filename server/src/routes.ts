import express from 'express';
import { Knex } from 'knex';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (req, res) => {

  const items = await knex('items').select('*');

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    }
  })

  return res.json(serializedItems);
});

routes.post('/points', async (req, res) => {

  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = req.body;


  const trx = await knex.transaction();

  const insertedIds = await trx('points').insert({
    image: 'image fake',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf
  });

  const point_id = insertedIds[0];

  const pointItems = items
    .split(',')
    .map((item: string) => Number(item.trim()))
    .map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

  await trx('point_items').insert(pointItems);

  await trx.commit();

  return res.json({ success: true });
});

export default routes;