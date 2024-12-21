import mysql from 'mysql2/promise';
import {DEFAULT_PROPERTIES} from './propertyGenerator.js'


async function insertProperties(properties) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'partha', // Replace with your username
    password: '', // Replace with your password
    database: 'PropertyDatabase' // Replace with your database name
  });

  const query = `
    INSERT INTO Properties (id, image, title, location, area, owner, price, description, amenities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    for (const property of properties) {
      await connection.execute(query, [
        property.id,
        property.image,
        property.title,
        property.location,
        property.area,
        property.owner,
        property.price,
        property.description,
        JSON.stringify(property.amenities) // Convert amenities array to JSON
      ]);
    }
    console.log('Properties inserted successfully.');
  } catch (error) {
    console.error('Error inserting properties:', error);
  } finally {
    await connection.end();
  }
}

insertProperties(DEFAULT_PROPERTIES);