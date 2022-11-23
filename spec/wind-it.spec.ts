import nock from 'nock';

import { Axios } from 'axios-observable';
import { map } from 'rxjs';
import { WeatherStationData } from '../src/model/weather-station-data.model';
import { Server } from '../src/server';

import { AddressInfo } from 'net';
import * as authResponse from './datas/auth-response.json';
import * as publicDataResponse from './datas/public-data-wind-response.json';

let app: Server;

describe('Temperature', () => {

    beforeAll((done: DoneFn) => {
        // Mock Netatmo Auth API call
        nock('https://api.netatmo.com')
            .post('/oauth2/token')
            .reply(200, authResponse);

        app = new Server({
            verbose: false,
            port: 0,
            clientId: '',
            clientSecret: '',
            username: '',
            password: '',
            latitude: 1,
            longitude: 2,
            distance: 3
        }, done);
    });

    afterAll((done) => {
        app?.server?.close(done);
    });
    
    it('Should return first wind datas', (done: DoneFn) => {
        // Mock Netatmo Data API call
        nock('https://api.netatmo.com')
            .post('/api/getpublicdata')
            .reply(200, publicDataResponse);

        Axios.get(`http://localhost:${(app.server.address() as AddressInfo).port}/weather`)
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
