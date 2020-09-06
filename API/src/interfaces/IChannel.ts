export default interface IChannel {
    currentValue: number;
    MaxValue: number;
    currentValuePct: number;


    incrementBrightness(): void;
    decrementBrightness(): void;

    setValuePct(pct: number): Promise<any>;

    setValue(val: Number): Promise<any>;
}