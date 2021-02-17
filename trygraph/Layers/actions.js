import LinearIcon from 'trygraph/assets/linear_icon.svg';
import QuadIcon from 'trygraph/assets/quadratic_icon.svg';
import CubicIcon from 'trygraph/assets/cubic_icon.svg';
import DrawIcon from 'trygraph/assets/draw_icon.svg';

export const linearAction = {
    action: () => console.log("Add linear"),
    image: LinearIcon,
    text: "y=mx+c",
}

export const quadAction = {
    action: () => console.log("Add quadratic"),
    image: QuadIcon,
    text: "x^2",
}

export const cubicAction = {
    action: () => console.log("Add cubic"),
    image: CubicIcon,
    text: "x^3",
}

export const drawAction = {
    action: () => console.log("Start Drawing"),
    image: DrawIcon,
    text: "draw",
}

export default [linearAction, quadAction, cubicAction, drawAction];