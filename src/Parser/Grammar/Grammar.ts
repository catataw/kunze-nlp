import GrammarRule = require("./GrammarRule");
import ProbabilityToken = require("../../PartOfSpeechTagger/ProbabilityToken");

class Grammar {
    private rules: GrammarRule[] = [];

    public getRule(index: number): GrammarRule {
        return this.rules[index];
    }

    public add(nodeName: string, tags: string) {
        for (let rule of this.rules) {
            if (rule.name === nodeName) {
                if (rule.matches.indexOf(tags) === -1) {
                    rule.matches.push(tags);
                }

                return;                
            }
        }

        this.rules.push(new GrammarRule(nodeName, [tags]));
    }

    public get(rules: string): string {
        for (let grammarRule of this.rules) {
            for (let match of grammarRule.matches) {
                if (rules === match) {
                    return grammarRule.name;
                }
            }
        }
    }

    public toString() {
        let grammar = "";

        for (let rule of this.rules) {
            let line = `${rule.name} -> ${rule.matches.join(" | ")}`;

            if (!grammar) {
                grammar = line;
            } else {
                grammar += `\n${line}`;
            }
        }

        return grammar.trim();
    }
}

export = Grammar;