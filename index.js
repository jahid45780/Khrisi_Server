const express = require('express');
const cors = require ('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174' ],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());


const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

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
    // await client.connect();

    const productCollection = client.db('Bangler_KrisiDB').collection('all_product') 
    const usersCollection = client.db('Bangler_KrisiDB').collection('users') 
     const addProductCollection = client.db('Bangler_KrisiDB').collection('addProduct')


     // get all product

 app.get('/all_product', async (req, res)=>{
  const result = await productCollection.find().toArray()
  res.send(result)

})
// product detail

app.get('/all_product/:id', async (req, res)=>{
  const id = req.params.id
  const result = await productCollection.findOne({_id: new ObjectId(id)})
  res.send(result)

})

// Save user DB
app.put('/users/:email', async (req, res) => {
  const email = req.params.email
  console.log(email);
  const user = req.body
  console.log(user);
  const query = {email: email}
  const options = {upsert: true}
  const  isExist = await usersCollection.findOne(query)
  console.log('User found?----->', isExist)
  if(isExist) {
    if(user?.status === 'Requested'){
        const result = await usersCollection.updateOne(
          query,
          {
            $set:user
          },
          options 
        )
        return res.send(result)
    } else{
      return res.send(isExist)
    }
  }
  const result = await usersCollection.updateOne(
   query,{
     $set: {...user, timestamp: Date.now()}
   },
   options,
)
res.send(result)
 })


 //  save a Product a database
app.post('/addProduct', async (req, res)=>{
  const product = req.body
  const result = await addProductCollection .insertOne(product)
  res.send(result)
})

// get user product add 

app.get('/addProduct', async (req, res)=>{
   const result = await addProductCollection. find().toArray()
   res.send(result)
})

//  get all user 
app.get('/users', async (req, res)=>{
   const result = await usersCollection.find().toArray()
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