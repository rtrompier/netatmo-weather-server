export class WeatherRain {
    public rain_60min?: number;
    public rain_24h?: number;
    public rain_live?: number;
    public rain_timeutc?: number;

    public static isWeatherRain(obj: unknown): obj is WeatherRain {
        return (obj as WeatherRain).rain_60min !== undefined && 
            (obj as WeatherRain).rain_24h !== undefined &&
            (obj as WeatherRain).rain_live !== undefined &&
            (obj as WeatherRain).rain_timeutc !== undefined;
    }
}
