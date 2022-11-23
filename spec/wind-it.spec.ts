import nock from 'nock';

import { Axios } from 'axios-observable';
import { map } from 'rxjs';
import { WeatherStationData } from '../src/model/weather-station-data.model';
import { Server } from '../src/server';

const authResponse = require('./datas/auth-response.json');
const publicDataResponse = require('./datas/public-data-wind-response.json');

let app: Server;

describe('Temperature', () => {

    beforeAll((done: DoneFn) => {
        // Mock Netatmo Auth API call
        nock('https://api.netatmo.com')
            .post('/oauth2/token')
            .reply(200, authResponse);

        app = new Server({
            log: true,
            port: 3000,
        }, done);
    });

    beforeEach(() => {
        // Mock Netatmo Data API call
        nock('https://api.netatmo.com')
            .post('/api/getpublicdata')
            .reply(200, publicDataResponse);
    })

    afterAll((done) => {
        app?.server?.close(done);
    });
    
    it('Should return first wind datas', (done: DoneFn) => {
        Axios.get(`http://localhost:3000/weather`)
            .pipe(map(resp => resp.data))
            .subscribe((body: WeatherStationData) => {
                expect(body.wind_strength).toEqual(2);
                expect(body.wind_angle).toEqual(288);
                expect(body.gust_strength).toEqual(2);
                expect(body.gust_angle).toEqual(156);
                expect(body.wind_timeutc).toEqual(1669154152);
                done();
            });
    });

});
