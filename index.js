const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvzcx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partCollection = client.db('manufacturer').collection('parts')

        app.get('/part', async(req, res)=>{
            const query={};
            const cursor = partCollection.find(query);
            const parts= await cursor.toArray();
            res.send(parts);
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