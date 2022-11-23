import express, { Express, Request, Response } from 'express';
import { Config } from './model/config.model';
import { WeatherStationData } from './model/weather-station-data.model';
import { NetatmoService } from './service/netatmo-service';

export class Server {
    public app: Express;
    public server: any;

    private readonly config: Config;
    private readonly netatmoService: NetatmoService;

    constructor(argv: any, callback?: () => void) {
        this.config = this.initConfig(argv);
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

        this.server = this.app.listen(this.config.serverPort, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${this.config.serverPort}`);
        });

        if (callback) {
            callback();
        }
    }

    private initConfig(argv: any): Config {
        const config = new Config();

        config.log = argv.verbose;
        config.serverPort = argv.port;

        console.log('CONFIG', config);


        return config;
    }

}
