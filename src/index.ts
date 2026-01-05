import yargs from "yargs";
import dotenv from "dotenv";
import { Server } from './server';

dotenv.config();

const argv = yargs(process.argv)
    .env('NWS')
    .options({
        verbose: {
            alias: 'v',
            type: 'boolean',
            default: false,
            description: 'Run with verbose mode'
        },
        port: {
            alias: 'p',
            type: 'number',
            default: 3000,
            description: 'Http server port'
        },
        latitude: {
            alias: 'lat',
            type: 'number',
            requiresArg: true,
            description: 'Latitude to search nearby'
        },
        longitude: {
            alias: 'lng',
            type: 'number',
            requiresArg: true,
            description: 'Longitude to search nearby'
        },
        distance: {
            alias: 'd',
            type: 'number',
            requiresArg: true,
            description: 'Distance to search nearby (in KM)'
        },
        netatmoToken: {
            alias: 't',
            type: 'string',
            requiresArg: true,
            description: 'Netatmo token'
        },
        netatmoRefreshToken: {
            alias: 'rt',
            type: 'string',
            requiresArg: true,
            description: 'Netatmo refresh token'
        },
        netatmoClientId: {
            alias: 'cid',
            type: 'string',
            requiresArg: true,
            description: 'Netatmo client ID'
        },
        netatmoClientSecret: {
            alias: 'cs',
            type: 'string',
            requiresArg: true,
            description: 'Netatmo client secret'
        }
    })
    .argv;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
new Server(argv as any);