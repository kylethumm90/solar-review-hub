
export interface ReviewMetadata {
  installCount: number | null;
  stillActive: string | null;
  lastInstallDate: string | null;
  installStates: string[];
  recommendEpc: string | null;
}
