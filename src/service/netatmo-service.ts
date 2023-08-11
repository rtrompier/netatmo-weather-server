import { Axios } from 'axios-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { BoundsCoords } from '../model/bounds-coords.model';
import { Config } from '../model/config.model';
import { WeatherMeasure } from '../model/weather-measure.model';
import { WeatherRain } from '../model/weather-rain.model';
import { WeatherStationData } from '../model/weather-station-data.model';
import { WeatherStation } from '../model/weather-station.model';
import { WeatherWind } from '../model/weather-wind.model';
import { GeoService } from './geo-service';

// TODO : 
// Improve error catching
// Improve calculation in memory 

export class NetatmoService {
    private readonly config: Config;
    private readonly boundCoords: BoundsCoords;
    private token!: string;
    private refreshToken!: string;

    constructor(config: Config) {
        this.config = config;
        this.boundCoords = new GeoService().getBoundsCoords(this.config.latitude, this.config.longitude, this.config.distance);
    }

    /**
     * Parse netatmo API, and extract the weathers data
     * @returns 
     */
    public getWeather(): Observable<WeatherStationData> {
        return this.auth()
            .pipe(
                switchMap(() => this.getData()),
                mergeMap((stations: WeatherStation[]) => stations),
                map((station: WeatherStation) => this.extractDateFromStation(station)),
                toArray(),
                map((datas: WeatherStationData[]) => this.calculateFinalValues(datas)),
                catchError(err => {
                    console.error('Error while parsing netatmo api', err);
                    throw new Error('Error while parsing netatmo api');
                })
            );
    }

    /**
     * Extract weather informations from a station
     * @param station 
     */
    private extractDateFromStation(station: WeatherStation): WeatherStationData {
        const weatherStationData = new WeatherStationData();
        Object.values(station.measures).forEach((measure) => {
            if (WeatherMeasure.isWeatherMeasure(measure)) {
                weatherStationData.temperature ??= this.extractMeasureValue(measure as WeatherMeasure, 'temperature');
                weatherStationData.humidity ??= this.extractMeasureValue(measure as WeatherMeasure, 'humidity');
                weatherStationData.pressure ??= this.extractMeasureValue(measure as WeatherMeasure, 'pressure');
            } else if (WeatherRain.isWeatherRain(measure)) {
                weatherStationData.rain_60min ??= (measure as WeatherRain).rain_60min;
                weatherStationData.rain_24h ??= (measure as WeatherRain).rain_24h;
                weatherStationData.rain_live ??= (measure as WeatherRain).rain_live;
                weatherStationData.rain_timeutc ??= (measure as WeatherRain).rain_timeutc;
            } else if (WeatherWind.isWeatherWind(measure)) {
                weatherStationData.wind_strength ??= (measure as WeatherWind).wind_strength;
                weatherStationData.wind_angle ??= (measure as WeatherWind).wind_angle;
                weatherStationData.gust_strength ??= (measure as WeatherWind).gust_strength;
                weatherStationData.gust_angle ??= (measure as WeatherWind).gust_angle;
                weatherStationData.wind_timeutc ??= (measure as WeatherWind).wind_timeutc;
            }
        });
        return weatherStationData;
    }

    /**
     * Extract measure for the type passed in params
     * @param measure
     */
    private extractMeasureValue(measure: WeatherMeasure, type: 'temperature' | 'humidity' | 'pressure'): number | undefined {
        const indexType = measure.type.indexOf(type);
        if (indexType === -1) {
            return undefined; // This measure do not support this type
        }

        if (Object.values(measure.res).length == 0) {
            return undefined; // No values founds
        }

        return Object.values(measure.res)[0][indexType];
    }

    /**
     * Calculate the final values to return
     * Temperature : is the average of the temperature from all stations
     * Humidity : is the average of the humidity from all stations
     * Pressure : is the average of the pressure from all stations
     * Rain : is the value from the shortest station (should be the first)
     * Wind : is the value from the shortest station (should be the first)
     * @param datas 
     * @returns 
     */
    private calculateFinalValues(datas: WeatherStationData[]): WeatherStationData {
        const finalResp = new WeatherStationData();

        const temps: number[] = datas.map(val => val.temperature).flatMap(val => val !== undefined ? [val] : []); // remove null values
        finalResp.temperature = parseFloat((temps.reduce((a, b) => a + b) / temps.length).toFixed(2));

        const humidities: number[] = datas.map(val => val.humidity).flatMap(val => val !== undefined ? [val] : []); // remove null values
        finalResp.humidity = parseFloat((humidities.reduce((a, b) => a + b) / humidities.length).toFixed(2));

        const pressures: number[] = datas.map(val => val.pressure).flatMap(val => val !== undefined ? [val] : []); // remove null values
        finalResp.pressure = parseFloat((pressures.reduce((a, b) => a + b) / pressures.length).toFixed(2));

        finalResp.rain_60min ??= datas.find(val => val.rain_60min !== undefined)?.rain_60min;
        finalResp.rain_24h ??= datas.find(val => val.rain_24h !== undefined)?.rain_24h;
        finalResp.rain_live ??= datas.find(val => val.rain_live !== undefined)?.rain_live;
        finalResp.rain_timeutc ??= datas.find(val => val.rain_timeutc !== undefined)?.rain_timeutc;

        finalResp.wind_strength ??= datas.find(val => val.wind_strength !== undefined)?.wind_strength;
        finalResp.wind_angle ??= datas.find(val => val.wind_angle !== undefined)?.wind_angle;
        finalResp.gust_strength ??= datas.find(val => val.gust_strength !== undefined)?.gust_strength;
        finalResp.gust_angle ??= datas.find(val => val.gust_angle !== undefined)?.gust_angle;
        finalResp.wind_timeutc ??= datas.find(val => val.wind_timeutc !== undefined)?.wind_timeutc;

        return finalResp;
    }

    /**
     * Find public access token in weather map home page
     * @returns 
     */
    private auth(): Observable<null> {
        if (this.token) {
            return of(null);
        }

        return Axios.get(`https://weathermap.netatmo.com`)
            .pipe(
                tap((resp) => {
                    if (this.config.verbose) {
                        console.log(`Netatmo auth response`, resp);
                    }
                }),
                map((resp) => {
                    const matches = /accessToken: "?(.*)"/gm.exec(resp.data);
                    if (matches && matches.length > 1) {
                        this.token = matches[1];
                    }
                    return null;
                })
            );
    }

    /**
     * Load datas from Netatmo
     */
    private getData(): Observable<WeatherStation[]> {
        if (this.config.verbose) {
            console.log('Bounding coordinates to search nearby', this.boundCoords);
        }

        return Axios.get(`https://app.netatmo.net/api/getpublicmeasures`, {
            headers: {
                "Authorization": `Bearer ${this.token}`,
            },
            data: {
                'lat_ne': this.boundCoords.ne.lat,
                'lon_ne': this.boundCoords.ne.lng,
                'lat_sw': this.boundCoords.sw.lat,
                'lon_sw': this.boundCoords.sw.lng,
                'limit': 2,
                'divider': 4,
                'zoom': 10,
                'date_end': 'last',
                'quality': 7,
            }
        })
        .pipe(
            tap((resp) => {
                if (this.config.verbose) {
                    console.log(`Weather API response`, resp.data);
                }
            }),
            map((resp) => resp.data.body)
        );
    }

}
