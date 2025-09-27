import { NFCData } from './types';

/**
 * NFC Adapter for reading chip IDs from vaccination wristbands
 *
 * This adapter handles NFC reading with fallback to mock mode for demo purposes.
 */

export class NFCAdapter {
  private mockMode: boolean;
  private isScanning: boolean = false;

  constructor() {
    this.mockMode = process.env.NEXT_PUBLIC_MOCK_NFC === 'true';
  }

  /**
   * Check if NFC is available in the browser
   */
  isSupported(): boolean {
    if (this.mockMode) return true;
    return 'NDEFReader' in window;
  }

  /**
   * Start scanning for NFC tags
   */
  async startScan(): Promise<NFCData> {
    if (this.mockMode) {
      return this.simulateScan();
    }

    if (!this.isSupported()) {
      throw new Error('NFC is not supported in this browser');
    }

    try {
      this.isScanning = true;

      // Request NFC permission
      const ndefReader = new (window as any).NDEFReader();
      await ndefReader.scan();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isScanning = false;
          reject(new Error('NFC scan timeout - no tag detected'));
        }, 30000); // 30 second timeout

        ndefReader.addEventListener('reading', (event: any) => {
          clearTimeout(timeout);
          this.isScanning = false;

          try {
            const chipId = this.extractChipId(event);
            resolve({
              chipId,
              timestamp: Date.now()
            });
          } catch (error) {
            reject(new Error('Failed to read chip ID from NFC tag'));
          }
        });

        ndefReader.addEventListener('readingerror', () => {
          clearTimeout(timeout);
          this.isScanning = false;
          reject(new Error('NFC reading error'));
        });
      });
    } catch (error) {
      this.isScanning = false;
      console.error('NFC scan failed:', error);
      throw new Error('Failed to start NFC scan. Please ensure NFC is enabled.');
    }
  }

  /**
   * Stop NFC scanning
   */
  stopScan(): void {
    this.isScanning = false;
    // In a real implementation, you'd stop the NDEFReader
  }

  /**
   * Check if currently scanning
   */
  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  /**
   * Generate a mock chip ID for development
   */
  generateMockChipId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `0x${this.hashString(timestamp + random)}`;
  }

  /**
   * Simulate NFC scan for demo purposes
   */
  private async simulateScan(): Promise<NFCData> {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      chipId: this.generateMockChipId(),
      timestamp: Date.now()
    };
  }

  /**
   * Extract chip ID from NFC NDEF record
   */
  private extractChipId(event: any): string {
    try {
      // In a real implementation, this would parse the NDEF record
      // and extract the chip ID from the vaccination wristband data
      const message = event.message;
      const record = message.records[0];

      if (record.recordType === 'text') {
        const textDecoder = new TextDecoder(record.encoding);
        const data = textDecoder.decode(record.data);

        // Parse the chip ID from the text data
        // Format might be something like "CHIP_ID:0x1234567890abcdef"
        const chipIdMatch = data.match(/CHIP_ID:([0-9a-fA-F]+)/);
        if (chipIdMatch) {
          return `0x${chipIdMatch[1]}`;
        }
      }

      // Fallback: use the tag's serial number
      return `0x${event.serialNumber}`;
    } catch (error) {
      throw new Error('Invalid NFC tag format');
    }
  }

  /**
   * Simple hash function for mock data
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16);
  }

  /**
   * Get human-readable status
   */
  getStatus(): string {
    if (this.mockMode) {
      return 'Mock Mode - Simulated NFC scanning';
    }
    if (!this.isSupported()) {
      return 'NFC not supported in this browser';
    }
    return 'NFC Ready';
  }
}

// Export singleton instance
export const nfcAdapter = new NFCAdapter();