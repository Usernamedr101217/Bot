import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

console.log(process.env.OPEN_API_KEY)
const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
})
const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Hi there'
    })
  })
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.8,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,

        });
        
    res.status(200).send({
        bot: response.data.choices[0].text
      });

    } catch (err) {
        console.log(err)
        res.status(500).send(err || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))