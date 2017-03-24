define('app',['exports', './entity'], function (exports, _entity) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);

            this.entities = [];
            this.delayedEntities = [];
            this.entityName = null;
            this.entityRace = null;
            this.entityClass = null;
            this.entityInitiative = 0;
            this.turnIndicator = 0;
        }

        App.prototype.addEntity = function addEntity() {
            var newEntity = new _entity.Entity(this.entityInitiative, this.entityName, this.entityRace, this.entityClass);
            if (this.entities.length == 0) {
                this.entities.push(newEntity);
            } else {
                for (var i = 0; i < this.entities.length; i++) {
                    if (newEntity.initiative > this.entities[i].initiative) {
                        this.entities.splice(i, 0, newEntity);
                        i = this.entities.length;
                    } else if (i == this.entities.length - 1) {
                        this.entities.push(newEntity);
                    }
                }
            }
            this.entityName = null;
            this.entityRace = null;
            this.entityClass = null;
            this.entityInitiative = 0;
            this.forceTurnEvaluation();
        };

        App.prototype.removeEntity = function removeEntity(entity, currentList) {
            var index = currentList.indexOf(entity);
            var removed = currentList[index];
            if (index !== -1) {
                currentList.splice(index, 1);
            }
            return removed;
        };

        App.prototype.delayEntity = function delayEntity(entity) {
            if (this.turnIndicator == this.entities.indexOf(entity)) {
                this.forceTurnEvaluation();
            }
            this.delayedEntities.push(this.removeEntity(entity, this.entities));
        };

        App.prototype.returnEntity = function returnEntity(entity) {
            this.entities.splice(this.turnIndicator, 0, this.removeEntity(entity, this.delayedEntities));
            this.forceTurnEvaluation();
        };

        App.prototype.forceTurnEvaluation = function forceTurnEvaluation() {
            this.turnIndicator -= 1;
            this.turnIndicator += 1;
        };

        App.prototype.adjustTurn = function adjustTurn(direction) {
            this.turnIndicator += direction;
            if (this.turnIndicator >= this.entities.length) {
                this.turnIndicator = 0;
            } else if (this.turnIndicator < 0) {
                this.turnIndicator = this.entities.length - 1;
            }
        };

        return App;
    }();
});
define('entity',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Entity = exports.Entity = function () {
        function Entity(init) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var race = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var gameClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            _classCallCheck(this, Entity);

            this.name = name;
            this.initiative = init;
            this.delaying = false;
            this.class = gameClass;
            this.race = race ? race : "?????";
        }

        Entity.prototype.display = function display() {
            if (this.name) {
                if (this.class) {
                    return this.name + ", the " + this.race + " " + this.class;
                }
                return this.name + ", the " + this.race;
            } else if (this.class) {
                return this.race + " " + this.class;
            }
            return "" + this.race;
        };

        Entity.prototype.delay = function delay() {
            this.delaying = true;
        };

        return Entity;
    }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><h1>Track that Initiative!</h1><form submit.trigger=\"addEntity()\">Name: <input type=\"text\" value.bind=\"entityName\"> Race: <input type=\"text\" value.bind=\"entityRace\"> Class: <input type=\"text\" value.bind=\"entityClass\"> Initiative: <input type=\"number\" step=\"1\" min=\"0\" value.bind=\"entityInitiative\"> <button type=\"submit\">Add Entity</button></form><button click.trigger=\"adjustTurn(1)\">Next Turn</button> <button click.trigger=\"adjustTurn(-1)\">Previous Turn</button><div class=\"row\"><div class=\"order-list seven columns\"><ol><li repeat.for=\"entity of entities\"><span class=\"\">${entity.display()} </span><button class=\"\" click.trigger=\"removeEntity()\">Remove from combat</button> <button class=\"\" click.trigger=\"delayEntity(entity)\">Delay</button> <span class=\"red large-text\" if.bind=\"entities.indexOf(entity) == turnIndicator\">&#9876</span></li></ol></div><div class=\"order-list five columns\"><ul><li repeat.for=\"entity of delayedEntities\"><span class=\"\">${entity.display()} </span><button class=\"\" click.trigger=\"returnEntity(entity)\">Return to Initiative</button></li></ul></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map