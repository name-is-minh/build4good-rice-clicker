require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('@notionhq/client');

const app = express();

const corsOptions = {
  origin: 'https://name-is-minh.github.io',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;
// app.use(cors());
app.use(bodyParser.json());

// Save user data based on username
app.post('/save-username', async (req, res) => {
    const { username, currentRice, farmerLvl, fertilizerLvl, momLvl, autoClickerLvl } = req.body;

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

// Fetch user data based on the username
app.post('/load-username', async (req, res) => {
    const { username } = req.body;
    console.log(username);
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Username',
          title: {
            equals: username,
          },
        },
      });
      
      if (response.results.length > 0) {
        const user = response.results[0].properties;

        const userData = {
          username: username,
          currentRice: user.CurrentRice.number || 0,
          farmerLvl: user.FarmerLvl.number || 0, 
          fertilizerLvl: user.FertilizerLvl.number || 0, 
          momLvl: user.MomLvl.number || 0, 
          autoClickerLvl: user.AutoClickerLvl.number || 0,
        };
  
        res.json(userData); 
      } else {
        res.status(404).json({ message: 'Username not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch data from Notion.' });
    }
  });
  
// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
