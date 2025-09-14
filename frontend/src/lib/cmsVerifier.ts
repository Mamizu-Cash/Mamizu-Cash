export interface X509Certificate {
  subject: string;
  issuer: string;
  serialNumber: string;
  notBefore: Date;
  notAfter: Date;
  publicKey: ArrayBuffer;
  publicKeyDer: ArrayBuffer;
  signatureAlgorithm: string;
}

export interface CMSSignature {
  signerInfo: {
    certificate: X509Certificate;
    signature: ArrayBuffer;
  };
  content: ArrayBuffer;
  isValid: boolean;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Remove whitespace and padding
  const cleanBase64 = base64.replace(/\s/g, "");

  try {
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  } catch (error) {
    console.error("Failed to decode base64:", error);
    throw new Error("Invalid base64 string");
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export function parseX509Certificate(certBuffer: ArrayBuffer): X509Certificate {
  // This is a simplified implementation
  // In a real application, you would use a proper ASN.1/X.509 parser like node-forge

  console.log("Parsing X.509 certificate, buffer length:", certBuffer.byteLength);

  // Mock certificate data for demo purposes
  return {
    subject: "CN=Demo Certificate,O=Demo Organization,C=JP",
    issuer: "CN=Demo CA,O=Demo CA Organization,C=JP",
    serialNumber: "123456789",
    notBefore: new Date("2024-01-01"),
    notAfter: new Date("2025-12-31"),
    publicKey: new ArrayBuffer(256), // Mock public key
    publicKeyDer: new ArrayBuffer(256), // Mock public key DER
    signatureAlgorithm: "SHA256withRSA",
  };
}

export function verifyCMSSignature(cmsData: ArrayBuffer): CMSSignature {
  // This is a simplified implementation
  // In a real application, you would use proper CMS/PKCS#7 verification

  console.log("Verifying CMS signature, data length:", cmsData.byteLength);

  const mockCertificate = parseX509Certificate(new ArrayBuffer(1024));

  return {
    signerInfo: {
      certificate: mockCertificate,
      signature: new ArrayBuffer(256), // Mock signature
    },
    content: new ArrayBuffer(512), // Mock signed content
    isValid: true, // Mock verification result
  };
}

export function extractSignedData(cmsSignature: CMSSignature): string {
  // Extract the signed data as a string
  const decoder = new TextDecoder();
  return decoder.decode(cmsSignature.content);
}

export function validateCertificateChain(certificate: X509Certificate): boolean {
  // Simplified certificate chain validation
  const now = new Date();

  // Check if certificate is still valid
  if (now < certificate.notBefore || now > certificate.notAfter) {
    console.warn("Certificate is expired or not yet valid");
    return false;
  }

  // In a real implementation, you would validate the entire certificate chain
  // against trusted root CAs
  return true;
}
