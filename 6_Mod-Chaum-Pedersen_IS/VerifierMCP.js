const mcl = require('mcl-wasm');

class Verifier{
    constructor(){
        // this.secretKey = new mcl.Fr(); //Fr = Zq czyli nasza grupa wykładników
        // this.secretKey.setByCSPRNG(); //pseudo random generator losujemy jakiś klucz jeden
        
        this.g1 = new mcl.G1();
        this.g1.setStr('1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569');
        this.g2 = new mcl.G1();
        this.g2.setStr('1 2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427 2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013');

    }

    consumeAX(A1,A2,X1,X2){
        this.A1 = new mcl.G1();
        this.A2 = new mcl.G1();
        this.A1 = A1;    
        this.A2 = A2;

        this.X1 = new mcl.G1();
        this.X2 = new mcl.G1();
        this.X1 = X1;       
        this.X2 = X2;
    }
    createChallenge(){
  
        this.c = new mcl.Fr();
        this.c.setByCSPRNG();
        return this.c;
    }

    verify(S1,S2){
        this.S1 = new mcl.G2();
        this.S1 = S1;

        this.S2 = new mcl.G2();
        this.S2 = S2;
        
        this.ghat1 = mcl.hashAndMapToG2(this.X1.getStr(10).slice(2) + this.c.getStr(10).slice(2));
        this.ghat2 = mcl.hashAndMapToG2(this.X2.getStr(10).slice(2) + this.c.getStr(10).slice(2));

        // I teraz pairingi, ale jakie?

        return 
    }
}

module.exports = Verifier;