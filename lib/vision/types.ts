export interface RoomAnalysisResult {
  roomType: string;
  floor: string;
  walls: string;
  lighting: string;
  existingFurniture: string[];
  observed: string[];
  inferred: string[];
  unknown: string[];
  isSuitableForPlacement: boolean;
  reasonIfNotSuitable?: string;
}

export interface VisualizationRequest {
  roomImageBase64: string;
  productId: string;
  productName: string;
  productDimensions?: string;
  presetStyle?: 'KEEP_ROOM' | 'MINIMAL' | 'WARM';
}

export interface VisualizationResult {
  imageUrl: string;
  success: boolean;
  errorMessage?: string;
  appliedPreset?: string;
  scaleNote?: string;
}

export interface IVisionProvider {
  analyzeRoom(imageBase64: string, mimeType: string): Promise<RoomAnalysisResult>;
}

export interface IImageGenerationProvider {
  generateVisualization(
    request: VisualizationRequest,
    analysis: RoomAnalysisResult,
    productReferenceUrl?: string
  ): Promise<VisualizationResult>;
}
