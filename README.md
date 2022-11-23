# NETATMO WEATHER SERVER

[![npm](https://img.shields.io/npm/v/netatmo-weather-server?color=blue&logo=npm)](https://www.npmjs.com/package/netatmo-weather-server)
[![Download](https://img.shields.io/npm/dw/netatmo-weather-server.svg?color=7986CB&logo=npm)](https://npmcharts.com/compare/netatmo-weather-server?minimal=true)
[![License](https://img.shields.io/npm/l/netatmo-weather-server.svg?color=ff69b4)](https://github.com/rtrompier/netatmo-weather-server/blob/main/LICENSE)


This project is a little NodeJS server exposing public weather datas through a rest api

## How to start

### Installation

Two options are available.

1. Use the docker image (recommended)

```sh
docker run -p 3000:3000 GHN_PORT=3000 --name netatmo-weather-server -d rtrompier/netatmo-weather-server:latest
```

2. Use the npm package

```sh
$ sudo npm install -g netatmo-weather-server
```
Or update to latest version when already installed:
```sh
$ sudo npm update -g netatmo-weather-server
```

### How to start (for NPM only)

```sh
$ netatmo-weather-server
```

You can pass the parameters through the node api. Execute this command to show all available parameters, or see Parameters section : 

```sh
$ netatmo-weather-server --help
```

### Parameters

You can pass the following params by environment variables : 
* **NWS_VERBOSE**        Run with verbose mode
* **NWS_PORT**           Http server port
* **NWS_CLIENT_ID**      Netatmo Client ID
* **NWS_CLIENT_SECRET**  Netatmo Client Secret
* **NWS_USERNAME**       Netatmo username
* **NWS_PASSWORD**       Netatmo password
* **NWS_LATITUDE**       Latitude to search nearby
* **NWS_LONGITUDE**      Longitude to search nearby
* **NWS_DISTANCE**       Distance to search nearby (in KM)


### How to use
A REST Api is available to get weathers data.

1. You juste have to execute a web request `GET http://YOUR_SERVER_IP:3000/weather`
1. You will receive a response with the following values :

| Parameter | Description |
| --- | --- |
| `temperature` | The average of the temperature values from all stations around your position |
| `humidity` | The average of the humidity values from all stations around your position |
| `pressure` | The average of the pressure values from all stations around your position |
| `rain_60min` | Quantity of rain during the last 60 min (in mm) |
| `rain_24h` | Quantity of rain during the last 24 hours (in mm) |
| `rain_live` | Is currently rainning (1 : yes, 0 : false) |
| `rain_timeutc` | Last time raining (timestamp) |
| `wind_strength` | Wind strength |
| `wind_angle` | Wind angle |
| `gust_strength` | Gust strength |
| `gust_angle` | Gust angle |
| `wind_timeutc` | Wind timestamp |


