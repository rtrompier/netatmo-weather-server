import { GeoService } from '../src/service/geo-service'

const geoService = new GeoService();

describe('GeoService', () => {

    it('should convert radian to degrees', () => {
        expect(geoService.rad2deg(0.7853981633974483)).toEqual(45);
    });

    it('should convert degrees to radian', () => {
        expect(geoService.deg2rad(45)).toEqual(0.7853981633974483);
    });

    it('should calculate bounding box', () => {
        const bounds = geoService.getBoundsCoords(46.2074023, 6.1561226, 1);
        expect(bounds.ne.lat).toEqual(46.21638550495336);
        expect(bounds.ne.lng).toEqual(6.169105296679325);
        expect(bounds.sw.lat).toEqual(46.198419095046624);
        expect(bounds.sw.lng).toEqual(6.143139903320675);
    });
});
