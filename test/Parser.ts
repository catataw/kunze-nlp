import assert = require("assert");
import IParser = require("../src/Parser/IParser");
import ParsedNode = require("../src/ParsedNode");
import CYKParser = require("../src/Parser/CYKParser");
import GrammarReader = require("../src/GrammarReader");
import ProbabilityToken = require("../src/ProbabilityToken");

describe("CYKParser", () => {
    it("Parse into a tree", () => {
        let tokens = [
            createToken("O", "ART"),
            createToken("cachorro", "N"),
            createToken("viu", "V"),
            createToken("o", "ART"),
            createToken("homem", "N"),
            createToken("no", "PREP+ART"),
            createToken("parque", "N")
        ]

    let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`;

        let grammarReader = new GrammarReader();
        let parser = new CYKParser(grammarReader);

        let sentences: ParsedNode[] = parser.parse(tokens, grammar);
        let sentence = sentences[0];

        let oCachorro = sentence.node(0);
        
        assert.equal(sentence.getNodeName(), "S");

        assert.equal(oCachorro.getNodeName(), "NP");
        assert.equal(oCachorro.toString(), "O cachorro");

        let viuOHomemNoParque = sentence.node(1);
        assert.equal(viuOHomemNoParque.getNodeName(), "VP");
        assert.equal(viuOHomemNoParque.toString(), "viu o homem no parque");

        let viu = viuOHomemNoParque.node(0);
        assert.equal(viu.getNodeName(), "V");
        assert.equal(viu.toString(), "viu");

        let oHomemNoParque = viuOHomemNoParque.node(1);
        assert.equal(oHomemNoParque.getNodeName(), "NP");
        assert.equal(oHomemNoParque.toString(), "o homem no parque");

        let oHomem = oHomemNoParque.node(0);
        assert.equal(oHomem.getNodeName(), "NP");
        assert.equal(oHomem.toString(), "o homem");

        let noParque = oHomemNoParque.node(1);
        assert.equal(noParque.getNodeName(), "PP");
        assert.equal(noParque.toString(), "no parque");
    });

    it("Throw exception", () => {
        let tokens = [
            createToken("O", "ART"),
            createToken("viu", "V"),
            createToken("homem", "N"),
            createToken("parque", "N")
        ]

    let grammar = `
S -> NP VP
NP -> ART N | NP PP
VP -> V NP
PP -> PREP NP | PREP N | PREP+ART NP | PREP+ART N`;

        let grammarReader = new GrammarReader();
        let parser = new CYKParser(grammarReader);
        let func = () => {
            console.log(parser.parse(tokens, grammar))
        };

        assert.throws(func, Error, "Invalid grammar");
    });

    function createToken(word: string, tag: string) {
        return new ProbabilityToken(word, tag, 1, true);
    }
});