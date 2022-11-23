import { Axios } from 'axios-observable';
import { map } from 'rxjs/operators';
import { Server } from '../src/server';

let app: Server;

describe('Healthcheck', () => {
    
    beforeAll((done: DoneFn) => {
        app = new Server({
            log: true,
            port: 3000,
        }, done);
    });

    afterAll((done) => {
        app?.server?.close(done);
    });

    it('Healthcheck should return 200 OK', (done: DoneFn) => {
        Axios.get(`http://localhost:3000/health`)
            .pipe(map((resp: any) => resp.data))
            .subscribe((resp) => {
                expect(resp.status).toEqual('OK');
                done();
            });
    });

});
