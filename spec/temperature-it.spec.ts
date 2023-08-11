import nock from 'nock';

import { Axios } from 'axios-observable';
import { map } from 'rxjs';
import { WeatherStationData } from '../src/model/weather-station-data.model';
import { Server } from '../src/server';

import { AddressInfo } from 'net';
import * as fs from 'fs';
import * as publicDataResponse from './datas/public-data-response.json';

let app: Server;

describe('Temperature', () => {

    beforeAll((done: DoneFn) => {
        const homeResponse = fs.readFileSync('./spec/datas/home.html','utf8');

        // Mock Netatmo Auth API call
        nock('https://weathermap.netatmo.com')
            .get('/')
            .reply(200, homeResponse);

        app = new Server({
            verbose: false,
            port: 0,
            latitude: 1,
            longitude: 2,
            distance: 3
        }, done);
    });

    afterAll((done) => {
        app?.server?.close(done);
    });

    it('Should return average temperature', (done: DoneFn) => {
        nock('https://app.netatmo.net')
            .get('/api/getpublicmeasures')
            .reply(200, publicDataResponse);

        Axios.get(`http://localhost:${(app.server.address() as AddressInfo).port}/weather`)
            .pipe(map(resp => resp.data))
            .subscribe((body: WeatherStationData) => {
                expect(body.temperature).toEqual(6); // (5.3+5.2+7.5)/3
                done();
            });
    });

});
