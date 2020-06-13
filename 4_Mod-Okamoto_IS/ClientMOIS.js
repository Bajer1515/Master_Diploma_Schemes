/*sudo openvpn --config abajerowicz.ovpn*/
const mcl = require('mcl-wasm');

mcl.init(mcl.BLS12_381).then( ()=>
{

const Prover = require('./ProverMOIS.js');
const rp = require('request-promise');

let prover = new Prover();

let hostname = 'http://127.0.0.1';

let port = '8080'; //'8443';
let base_path = 'protocols/mois';

let X = prover.createCommitment();
let A = prover.publicKey;

function encode(x){
    return x.getStr().slice(2);
}
let path = base_path+'/init';
let options = {
    method: 'POST',
    uri: `${hostname}:${port}/${path}`,
    body: {
        payload: {
            A: encode(A),
            X: encode(X)
        },
        protocol_name: 'mois'
    }, 
    json: true
}
console.log(options);
rp(options).then(res => {
    let c = new mcl.Fr();
    c.setStr(res.payload.c)
    
    let [S1, S2] = prover.genProof(c);
    
    let path = base_path+'/verify';
    let options = {
        method: 'POST',
        uri: `${hostname}:${port}/${path}`,
        body: {
            session_token: res.session_token,
            payload: {
                S1: encode(S1),  //S1.getStr(),
                S2: encode(S2)   //S2.getStr()
            },
            protocol_name: 'mois'
        }, 
        json: true
    }
    rp(options).then(res =>{
        console.log(res)
    })
});

})