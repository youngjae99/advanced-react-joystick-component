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
var InteractionEvents;
(function (InteractionEvents) {
    InteractionEvents["MouseDown"] = "mousedown";
    InteractionEvents["MouseMove"] = "mousemove";
    InteractionEvents["MouseUp"] = "mouseup";
    InteractionEvents["TouchStart"] = "touchstart";
    InteractionEvents["TouchMove"] = "touchmove";
    InteractionEvents["TouchEnd"] = "touchend";
})(InteractionEvents || (InteractionEvents = {}));
var Joystick = /** @class */ (function (_super) {
    __extends(Joystick, _super);
    function Joystick(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            dragging: false,
        };
        _this._stickRef = React.createRef();
        _this._baseRef = React.createRef();
        _this._throttleMoveCallback = (function () {
            var lastCall = 0;
            return function (event) {
                var now = new Date().getTime();
                var throttleAmount = _this.props.throttle || 0;
                if (now - lastCall < throttleAmount) {
                    return;
                }
                lastCall = now;
                if (_this.props.move) {
                    return _this.props.move(event);
                }
            };
        })();
        _this._boundMouseUp = function () {
            _this._mouseUp();
        };
        _this._boundMouseMove = function (event) {
            _this._mouseMove(event);
        };
        return _this;
    }
    Joystick.prototype._updatePos = function (coordinates) {
        var _this = this;
        window.requestAnimationFrame(function () {
            _this.setState({
                coordinates: coordinates,
            });
        });
        this._throttleMoveCallback({
            type: 'move',
            x: coordinates.relativeX,
            y: -coordinates.relativeY,
            direction: coordinates.direction,
        });
    };
    Joystick.prototype._mouseDown = function (e) {
        if (this.props.disabled !== true) {
            this._parentRect = this._baseRef.current.getBoundingClientRect();
            this.setState({
                dragging: true,
            });
            if (e.type === InteractionEvents.MouseDown) {
                window.addEventListener(InteractionEvents.MouseUp, this._boundMouseUp);
                window.addEventListener(InteractionEvents.MouseMove, this._boundMouseMove);
            }
            else {
                window.addEventListener(InteractionEvents.TouchEnd, this._boundMouseUp);
                window.addEventListener(InteractionEvents.TouchMove, this._boundMouseMove);
            }
            if (this.props.start) {
                this.props.start({
                    type: 'start',
                    x: null,
                    y: null,
                    direction: null,
                });
            }
        }
    };
    Joystick.prototype._getDirection = function (atan2) {
        if (atan2 > 2.35619449 || atan2 < -2.35619449) {
            return 'FORWARD';
        }
        else if (atan2 < 2.35619449 && atan2 > 0.785398163) {
            return 'RIGHT';
        }
        else if (atan2 < -0.785398163) {
            return 'LEFT';
        }
        return 'BACKWARD';
    };
    Joystick.prototype._getWithinBounds = function (value) {
        var halfBaseSize = this._baseSize / 2;
        if (value > halfBaseSize) {
            return halfBaseSize;
        }
        if (value < -halfBaseSize) {
            return halfBaseSize * -1;
        }
        return value;
    };
    Joystick.prototype._mouseMove = function (event) {
        if (this.state.dragging) {
            var absoluteX = null;
            var absoluteY = null;
            if (event.type === InteractionEvents.MouseMove) {
                absoluteX = event.clientX;
                absoluteY = event.clientY;
            }
            else {
                absoluteX = event.touches[0].clientX;
                absoluteY = event.touches[0].clientY;
            }
            var relativeX = this._getWithinBounds(absoluteX - this._parentRect.left - this._baseSize / 2);
            var relativeY = this._getWithinBounds(absoluteY - this._parentRect.top - this._baseSize / 2);
            var atan2 = Math.atan2(relativeX, relativeY);
            this._updatePos({
                relativeX: relativeX,
                relativeY: relativeY,
                direction: this._getDirection(atan2),
                axisX: absoluteX - this._parentRect.left,
                axisY: absoluteY - this._parentRect.top,
            });
        }
    };
    Joystick.prototype._mouseUp = function () {
        this.setState({
            dragging: false,
            coordinates: undefined,
        });
        window.removeEventListener('mouseup', this._boundMouseUp);
        window.removeEventListener('mousemove', this._boundMouseMove);
        if (this.props.stop) {
            this.props.stop({
                type: 'stop',
                x: null,
                y: null,
                direction: null,
            });
        }
    };
    Joystick.prototype._getBaseStyle = function () {
        var baseColor = this.props.baseColor !== undefined
            ? this.props.baseColor
            : '#000033';
        var baseSizeString = this._baseSize + "px";
        return {
            height: baseSizeString,
            width: baseSizeString,
            background: baseColor,
            borderRadius: this._baseSize,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    };
    Joystick.prototype._getStickStyle = function () {
        var stickColor = this.props.stickColor !== undefined
            ? this.props.stickColor
            : '#3D59AB';
        var stickSize = this._baseSize / 1.5 + "px";
        var stickStyle = {
            background: stickColor,
            cursor: 'move',
            height: stickSize,
            width: stickSize,
            borderRadius: this._baseSize,
            flexShrink: 0,
        };
        if (this.state.dragging && this.state.coordinates !== undefined) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: "translate3d(" + this.state.coordinates.relativeX + "px, " + this.state.coordinates.relativeY + "px, 0)",
            });
        }
        return stickStyle;
    };
    Joystick.prototype.render = function () {
        this._baseSize = this.props.size || 100;
        var baseStyle = this._getBaseStyle();
        var stickStyle = this._getStickStyle();
        return (React.createElement("div", { className: this.props.disabled ? 'joystick-base-disabled' : '', onMouseDown: this._mouseDown.bind(this), onTouchStart: this._mouseDown.bind(this), ref: this._baseRef, style: baseStyle },
            React.createElement("div", { ref: this._stickRef, className: this.props.disabled ? 'joystick-disabled' : '', style: stickStyle })));
    };
    return Joystick;
}(React.Component));
exports.Joystick = Joystick;
//# sourceMappingURL=Joystick.js.map