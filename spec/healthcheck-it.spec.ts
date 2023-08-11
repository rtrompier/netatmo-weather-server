import { Axios } from 'axios-observable';
import { AddressInfo } from 'net';
import { map } from 'rxjs/operators';
import { Server } from '../src/server';

let app: Server;

describe('Healthcheck', () => {
    
    beforeAll((done: DoneFn) => {
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

    it('Healthcheck should return 200 OK', (done: DoneFn) => {
        Axios.get(`http://localhost:${(app.server.address() as AddressInfo).port}/health`)
            .pipe(map((resp) => resp.data))
            .subscribe((resp) => {
                expect(resp.status).toEqual('OK');
                done();
            });
    });

});
