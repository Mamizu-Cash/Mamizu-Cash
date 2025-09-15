declare module "snarkjs" {
  export interface SnarkProof {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
  }

  export interface SnarkProofResult {
    proof: SnarkProof;
    publicSignals: string[];
  }

  export namespace groth16 {
    function fullProve(
      input: Record<string, any>,
      wasmPath: string,
      zkeyPath: string
    ): Promise<SnarkProofResult>;

    function verify(
      vKey: any,
      publicSignals: string[],
      proof: SnarkProof
    ): Promise<boolean>;
  }
}