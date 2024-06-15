const express = require('express');
const cors = require ('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d6oiejw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const productCollection = client.db('Bangler_KrisiDB').collection('all_product') 




     // get all product

 app.get('/all_product', async (req, res)=>{
  const result = await productCollection.find().toArray()
  res.send(result)

})
// product detail

app.get('/detail/:id', async (req, res)=>{
  const id = req.params.id
  console.log(id);
  const result = await productCollection.findOne({_id: new ObjectId(id)})
  res.send(result)

})





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Bangler Khrici..')
  })

  app.listen(port, () => {
    console.log(`Bangler Khici is running on port ${port}`)
  })