import { 
  getUniqueVendorTypes, 
  getOperatingRegions, 
  getRankings,
  checkOperatingStatesColumn 
} from './rankings';

export class RankingsService {
  static getUniqueVendorTypes = getUniqueVendorTypes;
  static getOperatingRegions = getOperatingRegions;
  static getRankings = getRankings;
  
  // Keep the private method for backward compatibility
  private static checkOperatingStatesColumn = checkOperatingStatesColumn;
}
