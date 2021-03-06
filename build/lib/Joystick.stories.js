"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("@storybook/react");
var addon_actions_1 = require("@storybook/addon-actions");
var Joystick_1 = require("./Joystick");
var joystickStories = react_1.storiesOf('Joystick Examples', module);
joystickStories.add("Default joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("Yellow (custom colors) joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), baseColor: "#FFFF99", stickColor: "#FFD300", move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("50ms throttled joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), throttle: 50, move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("100ms throttled joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), throttle: 100, move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("200ms throttled joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), throttle: 200, move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("500ms throttled joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), throttle: 500, move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped") }); });
joystickStories.add("HUGE joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped"), size: 500 }); });
joystickStories.add("Tiny joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped"), size: 50 }); });
joystickStories.add("Disabled joystick", function () { return React.createElement(Joystick_1.Joystick, { start: addon_actions_1.action("Started"), move: addon_actions_1.action("Moved"), stop: addon_actions_1.action("Stopped"), disabled: true }); });
var DirectionComponent = /** @class */ (function (_super) {
    __extends(DirectionComponent, _super);
    function DirectionComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            direction: "Stopped"
        };
        return _this;
    }
    DirectionComponent.prototype._handleMove = function (data) {
        this.setState({
            direction: data.direction
        });
    };
    DirectionComponent.prototype._handleStop = function (data) {
        this.setState({
            direction: "Stopped"
        });
    };
    DirectionComponent.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Joystick_1.Joystick, { move: this._handleMove.bind(this), stop: this._handleStop.bind(this) }),
            React.createElement("p", null, this.state.direction)));
    };
    return DirectionComponent;
}(React.Component));
joystickStories.add("Default with direction text", function () { return React.createElement(DirectionComponent, null); });
//# sourceMappingURL=Joystick.stories.js.map