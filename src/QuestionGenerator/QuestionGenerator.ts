import IQuestionGenerator = require("./IQuestionGenerator");
import ProbabilityToken = require("../ProbabilityToken");
import IParser = require("../Parser/IParser");
import ITransformer = require("./ITransformer");

class QuestionGenerator implements IQuestionGenerator {
    constructor(private parser: IParser, private transformers: ITransformer[]) {

    }

    public generate(tokens: ProbabilityToken[]): string[] {
        //pode ter vários ambiguos
        let parsedNodes = this.parser.parse(tokens);
        let arrayOfQuestions: string[] = [];

        for (let transformer of this.transformers) {
            for (let parsedNode of parsedNodes) {
                for(let question of transformer.transform(parsedNode)) {
                    arrayOfQuestions.push(question);                    
                }
            }
        }

        return arrayOfQuestions;
    }
}

export = QuestionGenerator;
