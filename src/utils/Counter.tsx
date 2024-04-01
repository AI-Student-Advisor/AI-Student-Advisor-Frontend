import { useEffect, useRef, useState } from "react";

type Func = () => void;
const noop = () => {};
interface CounterProp {
    time: number;
}
export default function Counter({ time }: CounterProp) {
    // eslint-disable-next-line no-magic-numbers
    const [counter, setCounter] = useState(time);
    const tickRef = useRef<Func>(noop);

    const tick = () => {
        // eslint-disable-next-line no-magic-numbers
        if (counter > 0) {
            // eslint-disable-next-line no-magic-numbers
            setCounter(counter - 1);
        }
    };

    useEffect(() => {
        tickRef.current = tick;
    });

    useEffect(() => {
        // eslint-disable-next-line no-magic-numbers
        const timer = setInterval(() => tickRef.current(), 1000);
        console.log("timerId", timer);
        return () => clearInterval(timer);
    }, []);
    return <p>{counter.toString()}</p>;
}
