import { BoundsCoords } from '../model/bounds-coords.model';

export class GeoService {

    public rad2deg = (radians: number): number => radians * (180 / Math.PI);

    public deg2rad = (degrees: number): number => degrees * (Math.PI / 180);

    public getBoundsCoords = (latitude: number, longitude: number, distance: number): BoundsCoords => {
        const radius = 6378.1;
    
        const neLat = this.rad2deg(Math.asin(Math.sin(this.deg2rad(latitude)) * Math.cos(distance / radius) + Math.cos(this.deg2rad(latitude)) * Math.sin(distance / radius) * Math.cos(this.deg2rad(0))));
        const swLat = this.rad2deg(Math.asin(Math.sin(this.deg2rad(latitude)) * Math.cos(distance / radius) + Math.cos(this.deg2rad(latitude)) * Math.sin(distance / radius) * Math.cos(this.deg2rad(180))));
        const neLng = this.rad2deg(this.deg2rad(longitude) + Math.atan2(Math.sin(this.deg2rad(90)) * Math.sin(distance / radius) * Math.cos(this.deg2rad(latitude)), Math.cos(distance / radius) - Math.sin(this.deg2rad(latitude)) * Math.sin(this.deg2rad(neLat))));
        const swLng = this.rad2deg(this.deg2rad(longitude) + Math.atan2(Math.sin(this.deg2rad(270)) * Math.sin(distance / radius) * Math.cos(this.deg2rad(latitude)), Math.cos(distance / radius) - Math.sin(this.deg2rad(latitude)) * Math.sin(this.deg2rad(neLat))));
    
        return {
            ne: {
                'lat': neLat,
                'lng': neLng
            }, 
            sw: {
                'lat': swLat,
                'lng': swLng
            }
        };
    };

}