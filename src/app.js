import {Entity} from './entity';

export class App {
    constructor() {
        this.entities = [];
        this.delayedEntities = [];
        this.entityName = null;
        this.entityRace = null;
        this.entityClass = null;
        this.entityInitiative = 0;
        this.turnIndicator = 0;
    }

    // Add a new entity to the initiative list.
    addEntity() {
        let newEntity = new Entity(this.entityInitiative,this.entityName, this.entityRace, this.entityClass)
        if ( this.entities.length == 0 ) {
            this.entities.push(newEntity);
        } else {
            for(let i = 0; i < this.entities.length; i++) {
                if( newEntity.initiative > this.entities[i].initiative) {
                    this.entities.splice(i, 0, newEntity);
                    i = this.entities.length;
                } else if (i == this.entities.length-1) {
                    this.entities.push(newEntity);
                }
            }
        }
        this.entityName = null;
        this.entityRace = null;
        this.entityClass = null;
        this.entityInitiative = 0;
        this.forceTurnEvaluation();
    }

    removeEntity(entity, currentList) {
        let index = currentList.indexOf(entity);
        let removed = currentList[index];
        if ( index !== -1 ) {
            currentList.splice(index, 1);
        }
        return removed;
    }

    delayEntity(entity) {
        if(this.turnIndicator == this.entities.indexOf(entity)) {
            this.forceTurnEvaluation();
        }
        this.delayedEntities.push(this.removeEntity(entity, this.entities));
    }

    returnEntity(entity) {
        this.entities.splice(this.turnIndicator, 0, this.removeEntity(entity, this.delayedEntities));
        this.forceTurnEvaluation();
    }

    // Aurelia doesn't re-evaluate the if.bind statement that checks where to display
    // the turn indicator when the entity is removed.
    // To force a re-render I have to manually change the turnIndicator value, then reset it.
    // FLAGGED FOR OPTIMIZATION
    forceTurnEvaluation() {
        this.turnIndicator -= 1;
        this.turnIndicator += 1;
    }

    adjustTurn(direction) {
        this.turnIndicator += direction;
        if(this.turnIndicator >= this.entities.length) {
            this.turnIndicator = 0;
        } else if (this.turnIndicator < 0) {
            this.turnIndicator = this.entities.length - 1;
        }
    }

    // moveEntity(entity) {
    //     if  ( entities.includes(entity) ){
    //         let moveMe = removeEntity(entity);
    //         delayedEntities.push(moveMe);
    //     }else{
    //         let moveMe = delayedEntities.removeEntity(entity);
    //         entities.push(moveMe);
    //     }
    // }
}