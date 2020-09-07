const mcl = require('mcl-wasm');

class Prover{
    constructor(){
        this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.g2 = new mcl.G1();
        this.g2.setStr('1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013');
        
        this.publicKey1 = mcl.mul(this.g1, this.secretKey); //działamy na eliptic curves, więc tutaj nie podnosimy do potęgi tylko mnożymy. I mamy nowy punkt.
        this.publicKey2 = mcl.mul(this.g2, this.secretKey);
    }

    createCommitment(){
        this.x = new mcl.Fr();
        this.x.setByCSPRNG();

        this.X1 = new mcl.G1();
        this.X1 = mcl.mul(this.g1, this.x);

        this.X2 = new mcl.G2();
        this.X2 = mcl.mul(this.g2, this.x);
        return [this.X1, this.X2];
    }

    genProof(c){
        //s=x+ac
        let s = new mcl.Fr();
        s = mcl.add(this.x, mcl.mul(this.secretKey,c));
        return s;
    }

}

module.exports = Prover;