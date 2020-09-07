const mcl = require('mcl-wasm');
const crypto = require('crypto');
mcl.init(mcl.BLS12_381).then( ()=>
{

const Verifier = require('./VerifierMCPIS.js');
let verifier = new Verifier();

var express = require('express');
var app = express(); 
app.use(express.json());

function decode(x){
    return '1 ' + x;
}

app.get('/protocols/', (req, res) => {
    res.json({schemas: ['mcpis']});
});

var port = 8080;

app.post('/protocols/mcpis/init', (req, res) => {
    let X1 = new mcl.G1();
    let X2 = new mcl.G1();
    let A1 = new mcl.G1();
    let A2 = new mcl.G1();
    let sessionToken = crypto.randomBytes(16).toString('base64');
    X1.setStr(decode(req.body.payload.X1));
    X2.setStr(decode(req.body.payload.X2)); 
    A1.setStr(decode(req.body.payload.A1));
    A2.setStr(decode(req.body.payload.A2));
    verifier.consumeAX(A1,A2,X1,X2);
    let c = verifier.createChallenge();
    let resp_body = {
        protocol_name: 'mcpis',
        payload: {c: c.getStr(10)},
        session_token: sessionToken 
    }
    res.json(resp_body);
})

app.post('/protocols/mcpis/verify', (req, res) =>{
    console.log(req.body);
    let S = new mcl.G2();
    S.setStr(decode(req.body.payload.S));
    let result = verifier.verify(S);
    console.log("Verified:", result)
    if(result){
        res.statusCode = 200;
    }
    else{
        res.statusCode = 403;
    }
    res.json({verified: result});
})

app.listen(port);
})