const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yitxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/',(req,res)=>{
        res.send("Coffee server is running")
    })


    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result);
    })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.listen(port,()=>{
        console.log(`coffee server is running on port ${port}`)
    })
  } 
  catch(err){
    console.log(err)
  }
}
run()








