const mongoose =  require("mongoose");

mongoose.connect("mongodb+srv://23b01a05i2:Eesha@123@cluster0.jtgrjul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 ")

.then(()=>
   console.log("connected to mongodb"))
   .catch(err => console.error("DB connection error:", err));
