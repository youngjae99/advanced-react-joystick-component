import * as React from 'react';

export interface IJoystickProps {
    size?: number;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
    disabled?: boolean;
    move?: (event: IJoystickUpdateEvent) => void;
    stop?: (event: IJoystickUpdateEvent) => void;
    start?: (event: IJoystickUpdateEvent) => void;
}
enum InteractionEvents {
    MouseDown = 'mousedown',
    MouseMove = 'mousemove',
    MouseUp = 'mouseup',
    TouchStart = 'touchstart',
    TouchMove = 'touchmove',
    TouchEnd = 'touchend',
}

export interface IJoystickUpdateEvent {
    type: 'move' | 'stop' | 'start';
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
}

export interface IJoystickState {
    dragging: boolean;
    coordinates?: IJoystickCoordinates;
}
type JoystickDirection = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD';
export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    axisX: number;
    axisY: number;
    direction: JoystickDirection;
}

class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private _stickRef: React.RefObject<any>;
    private _baseRef: React.RefObject<any>;
    private _throttleMoveCallback: (data: any) => void;
    private _boundMouseUp: EventListenerOrEventListenerObject;
    private _baseSize: number;
    private _parentRect: ClientRect;
    private _boundMouseMove: (event: any) => void;

    constructor(props: IJoystickProps) {
        super(props);
        this.state = {
            dragging: false,
        };
        this._stickRef = React.createRef();
        this._baseRef = React.createRef();

        this._throttleMoveCallback = (() => {
            let lastCall = 0;
            return (event: any) => {
                const now = new Date().getTime();
                const throttleAmount = this.props.throttle || 0;
                if (now - lastCall < throttleAmount) {
                    return;
                }
                lastCall = now;
                if (this.props.move) {
                    return this.props.move(event);
                }
            };
        })();

        this._boundMouseUp = () => {
            this._mouseUp();
        };
        this._boundMouseMove = (event: any) => {
            this._mouseMove(event);
        };
    }

    private _updatePos(coordinates: IJoystickCoordinates) {
        window.requestAnimationFrame(() => {
            this.setState({
                coordinates,
            });
        });
        this._throttleMoveCallback({
            type: 'move',
            x: coordinates.relativeX,
            y: -coordinates.relativeY,
            direction: coordinates.direction,
        });
    }

    private _mouseDown(e: any) {
        if (this.props.disabled !== true) {
            this._parentRect = this._baseRef.current.getBoundingClientRect();

            this.setState({
                dragging: true,
            });

            if (e.type === InteractionEvents.MouseDown) {
                window.addEventListener(
                    InteractionEvents.MouseUp,
                    this._boundMouseUp
                );
                window.addEventListener(
                    InteractionEvents.MouseMove,
                    this._boundMouseMove
                );
            } else {
                window.addEventListener(
                    InteractionEvents.TouchEnd,
                    this._boundMouseUp
                );
                window.addEventListener(
                    InteractionEvents.TouchMove,
                    this._boundMouseMove
                );
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
    }

    private _getDirection(atan2: number): JoystickDirection {
        if (atan2 > 2.35619449 || atan2 < -2.35619449) {
            return 'FORWARD';
        } else if (atan2 < 2.35619449 && atan2 > 0.785398163) {
            return 'RIGHT';
        } else if (atan2 < -0.785398163) {
            return 'LEFT';
        }
        return 'BACKWARD';
    }
    private _getWithinBounds(value: number): number {
        const halfBaseSize = this._baseSize / 2;
        if (value > halfBaseSize) {
            return halfBaseSize;
        }
        if (value < -halfBaseSize) {
            return halfBaseSize * -1;
        }
        return value;
    }
    private _mouseMove(event: any) {
        if (this.state.dragging) {
            let absoluteX = null;
            let absoluteY = null;
            if (event.type === InteractionEvents.MouseMove) {
                absoluteX = event.clientX;
                absoluteY = event.clientY;
            } else {
                absoluteX = event.touches[0].clientX;
                absoluteY = event.touches[0].clientY;
            }

            const relativeX = this._getWithinBounds(
                absoluteX - this._parentRect.left - this._baseSize / 2
            );
            const relativeY = this._getWithinBounds(
                absoluteY - this._parentRect.top - this._baseSize / 2
            );
            const atan2 = Math.atan2(relativeX, relativeY);

            this._updatePos({
                relativeX,
                relativeY,
                direction: this._getDirection(atan2),
                axisX: absoluteX - this._parentRect.left,
                axisY: absoluteY - this._parentRect.top,
            });
        }
    }

    private _mouseUp() {
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
    }
    private _getBaseStyle(): any {
        const baseColor: string =
            this.props.baseColor !== undefined
                ? this.props.baseColor
                : '#000033';

        const baseSizeString: string = `${this._baseSize}px`;
        return {
            height: baseSizeString,
            width: baseSizeString,
            background: baseColor,
            borderRadius: this._baseSize,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };
    }
    private _getStickStyle(): any {
        const stickColor: string =
            this.props.stickColor !== undefined
                ? this.props.stickColor
                : '#3D59AB';
        const stickSize: string = `${this._baseSize / 1.5}px`;

        let stickStyle = {
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
                transform: `translate3d(${this.state.coordinates.relativeX}px, ${this.state.coordinates.relativeY}px, 0)`,
            });
        }
        return stickStyle;
    }
    render() {
        this._baseSize = this.props.size || 100;
        const baseStyle = this._getBaseStyle();
        const stickStyle = this._getStickStyle();
        return (
            <div
                className={this.props.disabled ? 'joystick-base-disabled' : ''}
                onMouseDown={this._mouseDown.bind(this)}
                onTouchStart={this._mouseDown.bind(this)}
                ref={this._baseRef}
                style={baseStyle}
            >
                <div
                    ref={this._stickRef}
                    className={this.props.disabled ? 'joystick-disabled' : ''}
                    style={stickStyle}
                ></div>
            </div>
        );
    }
}

export { Joystick };
