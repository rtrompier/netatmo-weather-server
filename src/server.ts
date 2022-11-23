import * as http from 'http';
import express, { Express, Request, Response } from 'express';
import { Config } from './model/config.model';
import { WeatherStationData } from './model/weather-station-data.model';
import { NetatmoService } from './service/netatmo-service';
import { AddressInfo } from 'net';

export class Server {
    public app: Express;
    public server: http.Server;

    private readonly config: Config;
    private readonly netatmoService: NetatmoService;

    constructor(argv: Config, callback?: () => void) {
        this.config = argv;
        this.netatmoService = new NetatmoService(this.config);

        this.app = express();

        this.app.get('/health', (req: Request, res: Response) => {
            res.json({ status: 'OK' });
        });

        this.app.get('/weather', (req: Request, res: Response) => {
            this.netatmoService.getWeather().subscribe({
                next: (resp: WeatherStationData) => res.json(resp),
                error: (err) => res.status(500).json({ error: err })
            });
        });

        this.server = this.app.listen(this.config.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${(this.server.address() as AddressInfo).port}`);
        });

        if (callback) {
            callback();
        }
    }

}
