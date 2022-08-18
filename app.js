const express = require('express');
const app = express();
const cors = require('cors');
const { Client } = require('pg')
// const dbInfo = require('../DB/dbInfo')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.send('Success!');
})

app.get('/kor', (req, res)=>{
    res.send('안녕하세요');
});

app.get('/eng', (req, res)=>{
    res.send('Hello');
});

app.get('/jap', (req, res)=>{
    res.send('こんにちは');
});

app.listen(process.env.PORT || 3000,()=>{
    console.log('Start Server On Port 3000');
});

app.get('/language_all/',(req,res)=>{

    const client = new Client(dbInfo);

    client.connect();
    client.query('select language,msg from public."language"',(err,result)=>{
        if(err){
            console.log('Error ocquired');
        }else{
            res.send('ok');
            res.send(result.rows);
            console.log('ok');
        }
    })
})

app.post('/language',(req,res)=>{
    const lan = req.body.lan;
    const msg = req.body.msg;

    const client = new Client(dbInfo);
    client.connect();

    client.query('select language from public."language" where language = $1'[lan],(err,result)=>{
        if(err){
            console.log('Error',err);
        }else{
            res.send(result.rows);
        }
    })
})

app.post('/insert', (req,res)=>{
    const lan = req.body.lan;
    const msg = req.body.msg;

    const client = new Client(dbInfo);
    client.connect();
    // client.query('select * from public."language"',(err,result)=>{
    //     if(err){
    //         console.log('Error',err);
    //     }else{
    //         res.send('ok');
    //     }
    // })
    client.query('insert into public."language" values ($1,$2)',[lan,msg], (err,result)=>{
        if(err){
            console.log('Error',err);
        }else{
            res.send('ok');
        }
    })
})