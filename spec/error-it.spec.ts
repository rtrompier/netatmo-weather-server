// import nock from 'nock';

// import { Axios } from 'axios-observable';
// import { Server } from '../src/server';

// const publicDataResponse = require('./datas/public-data-wind-response.json');

// let app: Server;

// describe('Temperature', () => {

//     beforeAll((done: DoneFn) => {
//         app = new Server({
//             verbose: true,
//             port: 3000,
//         }, done);
//     });

//     beforeEach(() => {
//         // Mock Netatmo Data API call
//         nock('https://api.netatmo.com')
//             .post('/api/getpublicdata')
//             .reply(200, publicDataResponse);
//     })
// 
//     afterAll((done) => {
//         app?.server?.close(done);
//     });
    
//     it('Should return an error during authentication', (done: DoneFn) => {
//         // Mock Netatmo Auth API call
//         nock('https://api.netatmo.com')
//             .post('/oauth2/token')
//             .reply(500);

//         Axios.get(`http://localhost:3000/weather`)
//             .subscribe((resp) => {
//                 expect(resp.status).toEqual(500);
//                 done();
//             });
//     });

// });
