const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection =client.db('coffeeDB').collection('users')

    app.get('/',(req,res)=>{
        res.send("Coffee server is running")
    })

    app.get('/coffee',async(req,res)=>{
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)

    })

    app.get('/coffee/:id', async(req,res)=>{

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result =await coffeeCollection.findOne(query)
      res.send(result);


    })


    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee)
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result);
    })

    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedCoffee = req.body;
      const options = {upsert:true};
      const updateCoffee ={
        $set:{
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo

        }
      }

      const result =await coffeeCollection.updateOne(filter, updateCoffee,options);
      res.send(result) 
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteMany(query)
      res.send(result)

    })

    app.post('/users', async(req,res)=>{
      const newUser = req.body;
      console.log('creating new user', newUser)

      const result = await userCollection.insertOne(newUser)

      res.send(result)

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








