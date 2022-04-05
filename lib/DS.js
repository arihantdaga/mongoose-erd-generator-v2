const underlineText = str => `<U> ${str} </U>`
const boldText = str => `<B> ${str} </B>`;

class Relation {
    constructor(collection1, collection2, collection1Config){
        this.collection1 = collection1;
        this.collection2 = collection2;
        this.collection1Config = collection1Config;
    }
    generate(){
        const tailLabel = '1';
        const headLabel = 'N'
        return `${this.collection2}:${this.collection1Config.foreignField} -> ${this.collection1}:${this.collection1Config.localField.index}  [label="${this.collection2}-${this.collection1}" arrowhead=none shape="none" headlabel="${headLabel}" taillabel = "${tailLabel}"]`
    }
}

class ERD {
    constructor(name) {
        this.name = name;
        this.nodes = [];
        this.relations = [];
    }
    addRelation(collection1, collection2, collection1Config) {
        this.relations.push(new Relation(collection1, collection2, collection1Config));
    }
    addCollection(node) {
        this.nodes.push(node);
    }
    generate() {

        return `
        digraph {
        splines=true; esep=1;
        graph [margin="0" pad="2", nodesep="2", ranksep="2"  overlap=false, splines=true];
        node [shape=record, fontsize=11]
        edge [style=dashed];
        rankdir=LR;
        ${this.nodes.map(node => node.generate()).join('\n')}

        ${this.relations.map(relation=> relation.generate()).join('\n')}
        }
        `
    }
}

class Collection {

    constructor(name, options) {
        this.name = name;
        this.fields = [];
        this.options = options;
    }

    addField(name, options) {
        this.fields.push({
            name,
            options
        })
    }
    generate() {
        const fieldsString = [];

        for (const field of this.fields) {
            let nameString = field.name;
            let options = field.options;
            let fieldString = nameString;
            if (options.type) {
                fieldString += ' [' + options.type + ']';
            }
            fieldsString.push(fieldString);
        }
        return `

  ${this.name} [shape="none" margin=0 label=<<table BGCOLOR="${this.options.backgroundColor}"  border="0" cellborder="1" cellspacing="0" cellpadding="8">
  <tr><td  bgcolor="${this.options.nameColor}"  align="center" cellpadding="10">${boldText(this.name)}</td></tr>
      ${this.fields.map((field, i) => '<tr><td port=' + '"' + i + '"' + ' align="left" >' + field.name + ': ' + field.options.type + '</td></tr>').join('\n\t')}

  </table>>]
  `
    }



}




module.exports = { ERD, Collection };
