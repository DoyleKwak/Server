const express = require('express');
const app = express();
const cors = require('cors');
//db설정
const { Client } = require('pg');
//dbInfo 파일 가져오기
const dbInfo = require('../DB/dbInfo');

app.use(cors());

//post요청시 추가필요
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/kor', (req, res)=>{
    res.send('안녕하세요');
});

app.get('/eng', (req, res)=>{
    res.send('Hello');
});

app.get('/jap', (req, res)=>{
    res.send('こんにちは');
});

// app.get('/language/:lan',(req,res)=>{
    
//     const lan = req.params.lan;
//     let msg = '';

//     if(lan=='kor'){
//         msg = '안녕하세요';
//     }
//     else if(lan=='eng'){
//         msg = 'Hello';
//     }
//     else if(lan=='jap'){
//         msg = 'こんにちは';
//     }
//     res.send(msg);
// });


    


app.post('/language/',(req,res)=>{
 
    const lan = req.body.lan;
    const msg1 = req.body.msg;
    let msg = '';

    const client = new Client(dbInfo);
    client.connect()
    .then(()=>{
        // console.log("ok");
    })
    .catch((err)=>{
        console.log('error',err);
    });

    client.query('select msg from public."Language" where language = $1',[lan], (err,result)=>{      
        if(err){
            console.log('Error',err);
        }else{
            if(result.rowCount==0){
                client.query('insert into public."Language" values($1,$2)',[lan,msg1], (err,result)=>{
                    if(err){
                        console.log('error',err);
                    }
                    else{
                        console.log(result.rowCount);
                        console.log("The message has been Inserted")
                    }
                });
            }
            else{
                res.send(result.rows[0].msg);
            }          
        }       
    })

    
});

app.get('/language_all',(req,res)=>{

    const client = new Client(dbInfo);

    client.connect();
    client.query('select language,msg from public."Language"',(err, result)=>{
        res.send(result.rows);
    });

});

app.post('/search',(req,res)=>{
    const lan = req.body.lan;
    const client = new Client(dbInfo);

    client.connect();
    client.query('select msg from public."Language" where language=$1',[lan],(err,result)=>{
        if(err){
            console.log('error',err);
        }else{
            res.send(result.rows[0].msg);
        }
    })
})

app.post('/update',(req,res)=>{
    const lan = req.body.lan;
    const msg = req.body.msg;

    const client = new Client(dbInfo);

    client.connect();
    client.query('update public."Language" set msg=$2 where language=$1',[lan,msg],(err,result)=>{
        if(err){
            console.log('error',err);
        }else{
            res.send('ok');
        }
    })
})


app.post('/reg', (req, res)=>{
    const client = new Client(dbInfo);

    const lan = req.body.lan;
    const msg = req.body.msg;

    client.connect();
    client.query('insert into public."Language" values($1, $2)',[lan,msg],(err,result)=>{
        if(err){
            console.log('Error',err);
        }else{
            res.send('ok');
        }
        
    });
});

app.post('/del', (req,res)=>{
    const client = new Client(dbInfo);

    const item = req.body.item;

    client.connect();
    client.query('delete from public."Language" where language=$1',[item], (err,result)=>{
        if(err){
            console.log('error',err);
        }else{
            res.send('ok');
        }
    })
})



app.listen(3000,()=>{
    console.log('Start Server On Port 3000');
});


//app.get('/languageTest/:lan1', (res,req)=>{
//     const lan = req.params.lan1     
//     const client = new Client(dbInfo)
//     client.connect()
//     client.query('select language, msg from public."Language" where language=$1', [?],(err,result))=>{
//      res.send(result.rows);
// } 
// })