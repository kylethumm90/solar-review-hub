
// Export vendor type services
export { getUniqueVendorTypes } from './vendorService';

// Export operating regions services
export { getOperatingRegions } from './operatingRegionsService';

// Export rankings services
export { getRankings } from './rankingsService';

// Re-export everything from operatingRegionsService for backward compatibility
export * from './operatingRegionsService';
