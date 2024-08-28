const express = require('express');
const { Configuration, OpenAI } = require('openai');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Configuration OpenAI avec la clé API
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://sofft-cvfe.github.io/sofft-ai-frontend/',
}

app.use(cors(corsOptions));


// Middleware pour parser le JSON
app.use(express.json());

// Route pour gérer les requêtes à l'API OpenAI
app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        console.log( question );
        // Envoyer la requête à OpenAI
        const stream = await client.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [{ role: 'user', content: question }] ,
            max_tokens: 150,
            stream: true,
        });

        let answer = [];

        for await (const chunk of stream) {
          answer.push(chunk.choices[0]?.delta?.content || '');
        }
        // const answer = response.choices[0]?.delta?.content.trim();
        answer = answer.join('');
        res.json({ answer });

    } catch (error) {
        console.error("Erreur lors de la requête OpenAI:", error);
        res.status(500).json({ error: 'Une erreur est survenue avec l\'API OpenAI.' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
