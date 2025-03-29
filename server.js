require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('@notionhq/client');

// Initialize Express
const app = express();

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_API_KEY, // Make sure to set this environment variable
});

// Your Notion database ID (replace with your actual database ID)
const databaseId = process.env.NOTION_DATABASE_ID;
console.log(databaseId);
// Enable CORS
app.use(cors());

// Use body-parser to parse JSON requests
app.use(bodyParser.json());

// Save username and game data to Notion
app.post('/save-username', async (req, res) => {
    const { username, currentRice, farmerLvl, fertilizerLvl, momLvl, autoClickerLvl } = req.body;
    
  // Create a new page in the Notion database with the received data
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Username: {
          title: [
            {
              text: {
                content: username,
              },
            },
          ],
        },
        CurrentRice: {
          number: currentRice,
        },
        FarmerLvl: {
          number: farmerLvl,
        },
        FertilizerLvl: {
          number: fertilizerLvl,
        },
        MomLvl: {
          number: momLvl,
        },
        AutoClickerLvl: {
          number: autoClickerLvl,
        },
      },
    });

    console.log(`Username: ${username}, Rice: ${currentRice}, Farmer Level: ${farmerLvl}, Fertilizer Level: ${fertilizerLvl}, Mom Level: ${momLvl}, Autoclicker Level: ${autoClickerLvl}`);
    res.json({ message: 'Data saved to Notion!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save data to Notion.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
