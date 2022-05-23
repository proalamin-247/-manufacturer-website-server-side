const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvzcx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partCollection = client.db('manufacturer').collection('parts');
        const reviewCollection = client.db('manufacturer').collection('reviews');

        // load all parts 
        app.get('/part', async(req, res)=>{
            const query={};
            const cursor = partCollection.find(query);
            const parts= await cursor.toArray();
            res.send(parts);
        })


        // load singale part
        app.get('/part/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const part = await partCollection.findOne(query);
            res.send(part);
        })

        // load all reviews 
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // post singale review
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('manufacturer-website server')
})

app.listen(port, () => {
    console.log(`manufacturer-website app listening on port ${port}`)
})