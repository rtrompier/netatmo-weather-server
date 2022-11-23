import yargs from "yargs";
import { Server } from './server';

const argv = yargs(process.argv).options({
    verbose: {
        alias: 'v',
        type: 'boolean',
        default: process.env.NWS_VERBOSE || false,
        description: 'Run with verbose mode'
    },
    port: {
        alias: 'p',
        type: 'number',
        default: process.env.NWS_PORT || 3000,
        description: 'Http server port'
    },
    clientId: {
        alias: 'ci',
        type: 'string',
        default: process.env.NWS_CLIENT_ID || undefined,
        requiresArg: true,
        description: 'Netatmo Client ID'
    },
    clientSecret: {
        alias: 'cs',
        type: 'string',
        default: process.env.NWS_CLIENT_SECRET || undefined,
        requiresArg: true,
        description: 'Netatmo Client Secret'
    },
    username: {
        alias: 'u',
        type: 'string',
        default: process.env.NWS_USERNAME || undefined,
        requiresArg: true,
        description: 'Netatmo username'
    },
    password: {
        alias: 'pw',
        type: 'string',
        default: process.env.NWS_PASSWORD || undefined,
        requiresArg: true,
        description: 'Netatmo password'
    },
    latitude: {
        alias: 'lat',
        type: 'number',
        default: process.env.NWS_LATITUDE || undefined,
        requiresArg: true,
        description: 'Latitude to search nearby'
    },
    longitude: {
        alias: 'lng',
        type: 'number',
        default: process.env.NWS_LONGITUDE || undefined,
        requiresArg: true,
        description: 'Longitude to search nearby'
    },
    distance: {
        alias: 'd',
        type: 'number',
        default: process.env.NWS_DISTANCE || undefined,
        requiresArg: true,
        description: 'Distance to search nearby (in KM)'
    }
}).check((args) => {
    if (!args.clientId) {
        throw new Error("clientId is mandatory");
    }
    if (!args.clientSecret) {
        throw new Error("clientSecret is mandatory");
    }
    if (!args.username) {
        throw new Error("username is mandatory");
    }
    if (!args.password) {
        throw new Error("password is mandatory");
    }
    if (!args.latitude) {
        throw new Error("latitude is mandatory");
    }
    if (!args.longitude) {
        throw new Error("longitude is mandatory");
    }
    if (!args.distance) {
        throw new Error("distance is mandatory");
    }
})
    .argv;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
new Server(argv as any);