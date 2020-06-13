const mcl = require('mcl-wasm');

class Prover{
    constructor(){
        this.sk1 = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.sk1.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.sk2 = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.sk2.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        
        this.g2 = new mcl.G1();
        this.g2.setStr('1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013');
        
        this.publicKey = mcl.add(mcl.mul(this.g1,this.sk1),mcl.mul(this.g2,this.sk2)); //działamy na eliptic curves, więc tutaj nie podnosimy do potęgi tylko mnożymy. I mamy nowy punkt.
    }

    createCommitment(){
        this.x1 = new mcl.Fr();
        this.x1.setByCSPRNG();
        
        this.x2 = new mcl.Fr();
        this.x2.setByCSPRNG();

        // this.X = new mcl.G1();
        this.X = mcl.add(mcl.mul(this.g1,this.x1),mcl.mul(this.g2, this.x2));
        return this.X;
    }

    genProof(C){
        this.c = new mcl.Fr();
        this.c = C;
        this.s1 = mcl.add(this.x1, mcl.mul(this.sk1,this.c));
        this.s2 = mcl.add(this.x2, mcl.mul(this.sk2,this.c));
        
        this.ghat = mcl.hashAndMapToG2(this.X.getStr(10).slice(2) + this.c.getStr(10).slice(2));
        
        // let s1 = new mcl.Fr();
        
        // let S1 = new mcl.G2
        this.S1 = mcl.mul(this.ghat, this.s1); 
        this.S2 = mcl.mul(this.ghat, this.s2);
        // let s2 = new mcl.Fr();
        
        // let S2 = new mcl.G2
        

        return [this.S1, this.S2];
    }

}

module.exports = Prover;



/* this is hash
const crypto = require("crypto");
 
function hash(value)
{
    const r = '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001';
    const hash = crypto.createHash('SHA3-512')
    hash.update(value);
    mHash = hash.digest('hex')
 
    const rInt = BigInt(r);
    const hashInt = BigInt('0x'+mHash);
    return (hashInt % rInt).toString();
}
 
module.exports.hash = hash;
*/