const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>
{

const Prover = require('./ProverMCPIS.js');
const rp = require('request-promise');

let prover = new Prover();

let hostname = 'http://127.0.0.1';

let port = '8080';
let base_path = 'protocols/mcpis';

let [X1, X2] = prover.createCommitment();
let A1 = prover.publicKey1;
let A2 = prover.publicKey2;

function encode(x){
    return x.getStr().slice(2);
}
let path = base_path+'/init';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            A1: encode(A1),
            A2: encode(A2),
            X1: encode(X1),
            X2: encode(X2)
        },
        protocol_name: 'mcpis'
    }, 
    json: true
}
console.log(options);
rp(options).then(res => {
    let c = new mcl.Fr();
    c.setStr(res.payload.c)
    
    let S = prover.genProof(c);
    
    let path = base_path+'/verify';
    let options = {
        method: 'POST',
        uri: `${hostname}:${port}/${path}`,
        body: {
            session_token: res.session_token,
            payload: {
                S: encode(S)
            },
            protocol_name: 'mcpis'
        }, 
        json: true
    }
    rp(options).then(res =>{
        console.log(res)
    })
});

})