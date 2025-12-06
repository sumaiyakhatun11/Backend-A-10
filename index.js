const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://BackendPractice:L0Aqe2ZQm0bxLRJh@cluster0.052zdja.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db('PetService');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        app.post('/services', async (req, res) => {

            const data = req.body;
            const date = new Date();
            data.createdAt = date;
            const result = await serviceCollection.insertOne(data)
            res.send(result);

        })

        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.get('/myServices', async (req, res) => {
            const { email } = req.query;
            const query = { email: email };
            const result = await serviceCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        })

        app.put('/updateService/:id', async (req, res) => {
            const { id } = req.params;

            const data = req.body;
            const query = { _id: new ObjectId(id) };

            const updateService = {
                $set: data
            }

            const result = await serviceCollection.updateOne(query, updateService);
            res.send(result);



        })

        app.delete('/deleteService/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/orders', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await orderCollection.insertOne(data);
            res.send(result);

        }
        )

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Developers!')
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);

})
