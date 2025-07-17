import { createHash } from 'crypto';

export interface AssetInfo {
  id: string;
  type: 'image' | 'font' | 'icon' | 'document';
  filename: string;
  originalUrl: string;
  localPath: string;
  size: number;
  mimeType: string;
  hash: string;
  optimized?: boolean;
}

export interface AssetProcessingOptions {
  optimizeImages?: boolean;
  maxImageWidth?: number;
  maxImageHeight?: number;
  imageQuality?: number;
  convertToWebP?: boolean;
  generateThumbnails?: boolean;
}

export class AssetManager {
  private assets: Map<string, AssetInfo> = new Map();
  private processingQueue: string[] = [];

  async processAsset(
    url: string,
    type: AssetInfo['type'],
    options: AssetProcessingOptions = {}
  ): Promise<AssetInfo> {
    const hash = this.generateHash(url);
    
    // Check if asset already processed
    if (this.assets.has(hash)) {
      return this.assets.get(hash)!;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const mimeType = response.headers.get('content-type') || 'application/octet-stream';
      
      let processedBuffer = buffer;
      let filename = this.generateFilename(url, type, mimeType);
      
      // Process based on type and options
      if (type === 'image' && options.optimizeImages) {
        const result = await this.optimizeImage(buffer, mimeType, options);
        processedBuffer = result.buffer;
        filename = result.filename;
      }

      const assetInfo: AssetInfo = {
        id: hash,
        type,
        filename,
        originalUrl: url,
        localPath: `assets/${type}s/${filename}`,
        size: processedBuffer.byteLength,
        mimeType: options.convertToWebP && type === 'image' ? 'image/webp' : mimeType,
        hash,
        optimized: options.optimizeImages && type === 'image',
      };

      this.assets.set(hash, assetInfo);
      return assetInfo;
    } catch (error) {
      console.error(`Failed to process asset ${url}:`, error);
      throw error;
    }
  }

  async processPortfolioAssets(
    portfolio: any,
    options: AssetProcessingOptions = {}
  ): Promise<AssetInfo[]> {
    const assetUrls: Array<{ url: string; type: AssetInfo['type'] }> = [];

    // Extract profile image
    const heroSection = portfolio.sections.find((s: any) => s.type === 'hero');
    if (heroSection?.content?.avatar) {
      assetUrls.push({ url: heroSection.content.avatar, type: 'image' });
    }

    // Extract project images
    const projectsSection = portfolio.sections.find((s: any) => s.type === 'projects');
    if (projectsSection?.content?.items) {
      projectsSection.content.items.forEach((project: any) => {
        if (project.image) {
          assetUrls.push({ url: project.image, type: 'image' });
        }
      });
    }

    // Extract any other images from content
    portfolio.sections.forEach((section: any) => {
      if (section.content) {
        this.extractImagesFromContent(section.content, assetUrls);
      }
    });

    // Process all assets
    const processedAssets: AssetInfo[] = [];
    for (const { url, type } of assetUrls) {
      try {
        const asset = await this.processAsset(url, type, options);
        processedAssets.push(asset);
      } catch (error) {
        console.warn(`Failed to process asset ${url}:`, error);
      }
    }

    return processedAssets;
  }

  private extractImagesFromContent(
    content: any,
    assetUrls: Array<{ url: string; type: AssetInfo['type'] }>
  ): void {
    if (typeof content === 'string') {
      // Extract images from HTML content
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        if (match[1]) {
          assetUrls.push({ url: match[1], type: 'image' });
        }
      }
    } else if (typeof content === 'object' && content !== null) {
      Object.values(content).forEach((value) => {
        if (typeof value === 'string' && this.isImageUrl(value)) {
          assetUrls.push({ url: value, type: 'image' });
        } else if (typeof value === 'object') {
          this.extractImagesFromContent(value, assetUrls);
        }
      });
    }
  }

  private isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('image') ||
           lowerUrl.includes('photo') ||
           lowerUrl.includes('avatar');
  }

  private async optimizeImage(
    buffer: ArrayBuffer,
    mimeType: string,
    options: AssetProcessingOptions
  ): Promise<{ buffer: ArrayBuffer; filename: string }> {
    // In a real implementation, you would use a library like Sharp or similar
    // For now, we'll return the original buffer with optimized filename
    const extension = options.convertToWebP ? '.webp' : this.getExtensionFromMimeType(mimeType);
    const filename = `optimized_${Date.now()}${extension}`;
    
    return {
      buffer,
      filename,
    };
  }

  private generateHash(input: string): string {
    return createHash('md5').update(input).digest('hex');
  }

  private generateFilename(url: string, type: AssetInfo['type'], mimeType: string): string {
    const extension = this.getExtensionFromMimeType(mimeType);
    const hash = this.generateHash(url).substring(0, 8);
    return `${type}_${hash}${extension}`;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'text/html': '.html',
      'text/css': '.css',
      'application/javascript': '.js',
      'application/json': '.json',
    };

    return mimeToExt[mimeType] || '.bin';
  }

  getAsset(id: string): AssetInfo | undefined {
    return this.assets.get(id);
  }

  getAllAssets(): AssetInfo[] {
    return Array.from(this.assets.values());
  }

  getAssetsByType(type: AssetInfo['type']): AssetInfo[] {
    return Array.from(this.assets.values()).filter(asset => asset.type === type);
  }

  getTotalSize(): number {
    return Array.from(this.assets.values()).reduce((total, asset) => total + asset.size, 0);
  }

  clear(): void {
    this.assets.clear();
    this.processingQueue = [];
  }

  // Generate CSS for font loading
  generateFontCSS(fonts: string[]): string {
    const fontFaces = fonts.map(font => {
      return `@import url('https://fonts.googleapis.com/css2?family=${font}:wght@300;400;500;600;700&display=swap');`;
    }).join('\n');

    return fontFaces;
  }

  // Generate preload links for critical assets
  generatePreloadLinks(criticalAssets: AssetInfo[]): string {
    return criticalAssets.map(asset => {
      const rel = asset.type === 'font' ? 'preload' : 'prefetch';
      const asAttr = asset.type === 'font' ? ' as="font" crossorigin' : '';
      return `<link rel="${rel}" href="${asset.localPath}"${asAttr}>`;
    }).join('\n');
  }

  // Update HTML content to use local asset paths
  updateContentPaths(content: string, assetMap: Map<string, string>): string {
    let updatedContent = content;
    
    assetMap.forEach((localPath, originalUrl) => {
      // Replace all occurrences of the original URL with the local path
      const regex = new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      updatedContent = updatedContent.replace(regex, localPath);
    });

    return updatedContent;
  }
}

// Utility functions for asset validation
export const validateAssetUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getAssetTypeFromUrl = (url: string): AssetInfo['type'] => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return 'image';
  } else if (lowerUrl.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
    return 'font';
  } else if (lowerUrl.match(/\.(ico|png)$/) && lowerUrl.includes('icon')) {
    return 'icon';
  } else {
    return 'document';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};