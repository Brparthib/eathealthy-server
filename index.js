const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }) // for handling CORS policy error
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5btmpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("eatingtimeDb").collection("menu");
    const chefCollection = client.db("eatingtimeDb").collection("chef");
    const cartCollection = client.db("eatingtimeDb").collection("cart");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    app.get("/chef", async (req, res) => {
      const result = await chefCollection.find().toArray();
      res.send(result);
    });

    //carts menuCollection
    app.get("/cart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

app.get("/", (req, res) => {
  res.send("This is eating Time. Let's Eat");
});

app.listen(port, () => {
  console.log(`EatingTime is running on port ${port}`);
});

run().catch(console.dir);
