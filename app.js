const express = require('express');
const app = express();
const cors = require('cors');
const { Client } = require('pg')
// const dbInfo = require('../DB/dbInfo')

const dbInfo = {
    // user:'postgres'
    // ,password:'1234'
    // ,port:5432
    // ,host:'localhost'
    // ,database:'postgres'
    user:'envvirsgaluozg'
    ,password:'f5a36fc673a7211849f1cba9b71472c5a237f03cc644c3faf9bcf42ceead47d9'
    ,port:5432
    ,host:'ec2-54-85-56-210.compute-1.amazonaws.com'
    ,database:'d3e2bib785u554'
    ,ssl:{rejectUnauthorized:false}
}





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
    client.query('select * from public."language"',(err,result)=>{
        if(err){
            console.log('Error ocquired');
        }else{
            
            res.send(result.rows);
            
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