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
declare type JoystickDirection = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD';
export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    axisX: number;
    axisY: number;
    direction: JoystickDirection;
}
declare class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private _stickRef;
    private _baseRef;
    private _throttleMoveCallback;
    private _boundMouseUp;
    private _baseSize;
    private _parentRect;
    private _boundMouseMove;
    constructor(props: IJoystickProps);
    private _updatePos;
    private _mouseDown;
    private _getDirection;
    private _getWithinBounds;
    private _mouseMove;
    private _mouseUp;
    private _getBaseStyle;
    private _getStickStyle;
    render(): JSX.Element;
}
export { Joystick };
