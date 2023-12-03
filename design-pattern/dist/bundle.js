/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/observer/DiceGame.ts":
/*!**********************************!*\
  !*** ./src/observer/DiceGame.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var DiceGame = /** @class */ (function () {
    function DiceGame() {
        this.players = new Array();
    }
    DiceGame.prototype.addPlayer = function (player) {
        this.players.push(player);
    };
    return DiceGame;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DiceGame);


/***/ }),

/***/ "./src/observer/EvenBettingPlayer.ts":
/*!*******************************************!*\
  !*** ./src/observer/EvenBettingPlayer.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/observer/Player.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var EvenBettingPlayer = /** @class */ (function (_super) {
    __extends(EvenBettingPlayer, _super);
    function EvenBettingPlayer(name) {
        return _super.call(this, name) || this;
    }
    EvenBettingPlayer.prototype.update = function (diceNumber) {
        this._winning = diceNumber % 2 === 0;
    };
    return EvenBettingPlayer;
}(_Player__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EvenBettingPlayer);


/***/ }),

/***/ "./src/observer/NBettingPlayer.ts":
/*!****************************************!*\
  !*** ./src/observer/NBettingPlayer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/observer/Player.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var NBettingPlayer = /** @class */ (function (_super) {
    __extends(NBettingPlayer, _super);
    function NBettingPlayer(name, ns) {
        var _this = _super.call(this, name) || this;
        _this.ns = ns;
        return _this;
    }
    NBettingPlayer.prototype.update = function (diceNumber) {
        this._winning = this.ns.includes(diceNumber);
    };
    return NBettingPlayer;
}(_Player__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NBettingPlayer);


/***/ }),

/***/ "./src/observer/OddBettingPlayer.ts":
/*!******************************************!*\
  !*** ./src/observer/OddBettingPlayer.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Player */ "./src/observer/Player.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var OddBettingPlayer = /** @class */ (function (_super) {
    __extends(OddBettingPlayer, _super);
    function OddBettingPlayer(name) {
        return _super.call(this, name) || this;
    }
    OddBettingPlayer.prototype.update = function (diceNumber) {
        this._winning = diceNumber % 2 === 1;
    };
    return OddBettingPlayer;
}(_Player__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OddBettingPlayer);


/***/ }),

/***/ "./src/observer/PairDiceGame.ts":
/*!**************************************!*\
  !*** ./src/observer/PairDiceGame.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DiceGame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DiceGame */ "./src/observer/DiceGame.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var FairDiceGame = /** @class */ (function (_super) {
    __extends(FairDiceGame, _super);
    function FairDiceGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FairDiceGame.prototype.play = function () {
        var diceNumber = Math.floor(Math.random() * 6) + 1;
        this.players.forEach(function (player) {
            player.update(diceNumber);
        });
        return diceNumber;
    };
    return FairDiceGame;
}(_DiceGame__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FairDiceGame);


/***/ }),

/***/ "./src/observer/Player.ts":
/*!********************************!*\
  !*** ./src/observer/Player.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Player = /** @class */ (function () {
    function Player(_name) {
        this._name = _name;
        this._winning = false;
    }
    Object.defineProperty(Player.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "winning", {
        get: function () {
            return this._winning;
        },
        enumerable: false,
        configurable: true
    });
    return Player;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/observer/index.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EvenBettingPlayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EvenBettingPlayer */ "./src/observer/EvenBettingPlayer.ts");
/* harmony import */ var _NBettingPlayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NBettingPlayer */ "./src/observer/NBettingPlayer.ts");
/* harmony import */ var _OddBettingPlayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OddBettingPlayer */ "./src/observer/OddBettingPlayer.ts");
/* harmony import */ var _PairDiceGame__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PairDiceGame */ "./src/observer/PairDiceGame.ts");




var diceGame = new _PairDiceGame__WEBPACK_IMPORTED_MODULE_3__["default"]();
var players = [
    new _OddBettingPlayer__WEBPACK_IMPORTED_MODULE_2__["default"]("홀쭉이"),
    new _EvenBettingPlayer__WEBPACK_IMPORTED_MODULE_0__["default"]("짝눈이"),
    new _NBettingPlayer__WEBPACK_IMPORTED_MODULE_1__["default"]("점쟁이", [2, 3, 5]),
];
players.forEach(function (player) { return diceGame.addPlayer(player); });
function updateBoard() {
    var domPlayers = document.querySelector(".players");
    domPlayers.innerHTML = "";
    players.forEach(function (player) {
        var domPlayer = document.createElement("div");
        domPlayer.innerText = player.name;
        if (player.winning) {
            domPlayer.classList.add("win");
        }
        domPlayers.append(domPlayer);
    });
}
updateBoard();
document.querySelector("button").addEventListener("click", function () {
    var diceNumber = diceGame.play();
    var domDice = document.querySelector(".dice");
    domDice.innerText = diceNumber.toString();
    updateBoard();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU8sRUFBRTtJQUN6RCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbkMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQWdCLENBQUM7SUFDL0QsT0FBTyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFMUMsV0FBVyxFQUFFLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9EaWNlR2FtZS50cyIsIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9FdmVuQmV0dGluZ1BsYXllci50cyIsIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9OQmV0dGluZ1BsYXllci50cyIsIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9PZGRCZXR0aW5nUGxheWVyLnRzIiwid2VicGFjazovL2Rlc2lnbi1wYXR0ZXJuLy4vc3JjL29ic2VydmVyL1BhaXJEaWNlR2FtZS50cyIsIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vZGVzaWduLXBhdHRlcm4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGVzaWduLXBhdHRlcm4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Rlc2lnbi1wYXR0ZXJuL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGVzaWduLXBhdHRlcm4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZXNpZ24tcGF0dGVybi8uL3NyYy9vYnNlcnZlci9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRGljZUdhbWUge1xyXG4gIHByb3RlY3RlZCBwbGF5ZXJzID0gbmV3IEFycmF5PFBsYXllcj4oKTtcclxuXHJcbiAgYWRkUGxheWVyKHBsYXllcjogUGxheWVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gIH1cclxuXHJcbiAgYWJzdHJhY3QgcGxheSgpOiBudW1iZXI7XHJcbn1cclxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW5CZXR0aW5nUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRpY2VOdW1iZXI6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5fd2lubmluZyA9IGRpY2VOdW1iZXIgJSAyID09PSAwO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTkJldHRpbmdQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHJpdmF0ZSBuczogQXJyYXk8bnVtYmVyPikge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZGljZU51bWJlcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl93aW5uaW5nID0gdGhpcy5ucy5pbmNsdWRlcyhkaWNlTnVtYmVyKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9kZEJldHRpbmdQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgc3VwZXIobmFtZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZGljZU51bWJlcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl93aW5uaW5nID0gZGljZU51bWJlciAlIDIgPT09IDE7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBEaWNlR2FtZSBmcm9tIFwiLi9EaWNlR2FtZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFpckRpY2VHYW1lIGV4dGVuZHMgRGljZUdhbWUge1xyXG4gIHBsYXkoKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGRpY2VOdW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KSArIDE7XHJcblxyXG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG4gICAgICBwbGF5ZXIudXBkYXRlKGRpY2VOdW1iZXIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGljZU51bWJlcjtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUGxheWVyIHtcclxuICBwcm90ZWN0ZWQgX3dpbm5pbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmFtZTogc3RyaW5nKSB7fVxyXG5cclxuICBnZXQgbmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHdpbm5pbmcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fd2lubmluZztcclxuICB9XHJcblxyXG4gIGFic3RyYWN0IHVwZGF0ZShkaWNlTnVtYmVyOiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEV2ZW5CZXR0aW5nUGxheWVyIGZyb20gXCIuL0V2ZW5CZXR0aW5nUGxheWVyXCI7XHJcbmltcG9ydCBOQmV0dGluZ1BsYXllciBmcm9tIFwiLi9OQmV0dGluZ1BsYXllclwiO1xyXG5pbXBvcnQgT2RkQmV0dGluZ1BsYXllciBmcm9tIFwiLi9PZGRCZXR0aW5nUGxheWVyXCI7XHJcbmltcG9ydCBGYWlyRGljZUdhbWUgZnJvbSBcIi4vUGFpckRpY2VHYW1lXCI7XHJcblxyXG5jb25zdCBkaWNlR2FtZSA9IG5ldyBGYWlyRGljZUdhbWUoKTtcclxuXHJcbmNvbnN0IHBsYXllcnMgPSBbXHJcbiAgbmV3IE9kZEJldHRpbmdQbGF5ZXIoXCLtmYDsrYnsnbRcIiksXHJcbiAgbmV3IEV2ZW5CZXR0aW5nUGxheWVyKFwi7Ked64iI7J20XCIpLFxyXG4gIG5ldyBOQmV0dGluZ1BsYXllcihcIuygkOyfgeydtFwiLCBbMiwgMywgNV0pLFxyXG5dO1xyXG5cclxucGxheWVycy5mb3JFYWNoKChwbGF5ZXIpID0+IGRpY2VHYW1lLmFkZFBsYXllcihwbGF5ZXIpKTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKCkge1xyXG4gIGNvbnN0IGRvbVBsYXllcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcnNcIik7XHJcbiAgZG9tUGxheWVycy5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICBwbGF5ZXJzLmZvckVhY2goKHBsYXllcikgPT4ge1xyXG4gICAgY29uc3QgZG9tUGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGRvbVBsYXllci5pbm5lclRleHQgPSBwbGF5ZXIubmFtZTtcclxuXHJcbiAgICBpZiAocGxheWVyLndpbm5pbmcpIHtcclxuICAgICAgZG9tUGxheWVyLmNsYXNzTGlzdC5hZGQoXCJ3aW5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZG9tUGxheWVycy5hcHBlbmQoZG9tUGxheWVyKTtcclxuICB9KTtcclxufVxyXG5cclxudXBkYXRlQm9hcmQoKTtcclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjb25zdCBkaWNlTnVtYmVyID0gZGljZUdhbWUucGxheSgpO1xyXG5cclxuICBjb25zdCBkb21EaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaWNlXCIpIGFzIEhUTUxFbGVtZW50O1xyXG4gIGRvbURpY2UuaW5uZXJUZXh0ID0gZGljZU51bWJlci50b1N0cmluZygpO1xyXG5cclxuICB1cGRhdGVCb2FyZCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9