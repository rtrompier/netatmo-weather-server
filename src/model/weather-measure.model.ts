export class WeatherMeasure {
    public res!: Record<string, number[]>;
    public type!: ('temperature'|'humidity'|'pressure')[];

    public static isWeatherMeasure(obj: unknown): obj is WeatherMeasure {
        return (obj as WeatherMeasure).res !== undefined && (obj as WeatherMeasure).type !== undefined;
    }
}
