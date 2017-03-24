export class Entity {
    constructor(init, name = null, race = null, gameClass = null) {
        this.name = name;
        this.initiative = init;
        this.delaying = false;
        this.class = gameClass;
        this.race = race ? race : "?????";
    }

    // setInitiative(init) {
    //     this.initiative = init;
    // }

    display() {
        if(this.name) {
            if(this.class) {
                return `${this.name}, the ${this.race} ${this.class}`;
            }
            return `${this.name}, the ${this.race}`;
        } else if(this.class) {
            return `${this.race} ${this.class}`;
        }
        return `${this.race}`;
    }

    delay() {
        this.delaying = true;
    }
}