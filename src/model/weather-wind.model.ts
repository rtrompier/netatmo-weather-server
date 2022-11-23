export class WeatherWind {
    public wind_strength!: number;
    public wind_angle?: number;
    public gust_strength?: number;
    public gust_angle?: number;
    public wind_timeutc?: number;

    public static isWeatherWind(obj: unknown): obj is WeatherWind {
        return (obj as WeatherWind).wind_strength !== undefined && 
            (obj as WeatherWind).wind_angle !== undefined &&
            (obj as WeatherWind).gust_strength !== undefined &&
            (obj as WeatherWind).gust_angle !== undefined &&
            (obj as WeatherWind).wind_timeutc !== undefined;
    }
}
