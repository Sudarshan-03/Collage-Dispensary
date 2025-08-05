const mongose = require('mongoose')

mongose.connect('mongodb+srv://user2:DtBYt1Qm0Gwiulul@dispensarysystem.mmleubz.mongodb.net/?retryWrites=true&w=majority&appName=DispensarySystem')

    .then(res => {
        console.log("Database connected successfully");
    }).catch (err=>{
        console.error("Database connection failed:", err)
    })
