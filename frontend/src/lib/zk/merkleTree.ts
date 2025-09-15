/**
 * Simple Merkle Tree implementation for privacy pool withdrawals
 */
export class MerkleTree {
  public readonly height: number;
  public readonly zeroValue: bigint;
  private hashFunction: (left: bigint, right: bigint) => Promise<bigint>;
  private tree: (bigint | null)[][];
  private nextIndex: number;

  constructor(height: number, hashFunction: (left: bigint, right: bigint) => Promise<bigint>) {
    this.height = height;
    this.hashFunction = hashFunction;
    // Use the same zero value as in Tornado Cash
    this.zeroValue = 21663839004416932945382355908790599225266501822907911457504978515578255421292n;
    this.nextIndex = 0;

    // Initialize tree with null values
    this.tree = [];
    for (let level = 0; level <= height; level++) {
      this.tree[level] = new Array(2 ** (height - level)).fill(null);
    }
  }

  /**
   * Insert a leaf into the tree
   */
  async insert(leaf: bigint): Promise<void> {
    if (this.nextIndex >= 2 ** this.height) {
      throw new Error("Tree is full");
    }

    // Set the leaf
    this.tree[0][this.nextIndex] = leaf;

    // Update the tree bottom-up
    await this.updateTreePath(this.nextIndex);

    this.nextIndex++;
  }

  /**
   * Get the root of the tree
   */
  root(): bigint {
    return this.tree[this.height][0] || this.zeroValue;
  }

  /**
   * Get the path from a leaf to the root
   */
  path(index: number): { pathElements: bigint[]; pathIndices: number[] } {
    if (index >= this.nextIndex) {
      throw new Error("Index out of bounds");
    }

    const pathElements: bigint[] = [];
    const pathIndices: number[] = [];

    let currentIndex = index;
    for (let level = 0; level < this.height; level++) {
      const isLeft = currentIndex % 2 === 0;
      const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1;

      // Get sibling value or zero value if it doesn't exist
      const sibling = this.tree[level][siblingIndex] || this.getZeroHash(level);
      pathElements.push(sibling);
      pathIndices.push(isLeft ? 0 : 1);

      currentIndex = Math.floor(currentIndex / 2);
    }

    return { pathElements, pathIndices };
  }

  /**
   * Update the tree path for a given leaf index
   */
  private async updateTreePath(leafIndex: number): Promise<void> {
    let currentIndex = leafIndex;

    for (let level = 0; level < this.height; level++) {
      const isLeft = currentIndex % 2 === 0;
      const siblingIndex = isLeft ? currentIndex + 1 : currentIndex - 1;

      const left = isLeft
        ? this.tree[level][currentIndex] || this.getZeroHash(level)
        : this.tree[level][siblingIndex] || this.getZeroHash(level);

      const right = isLeft
        ? this.tree[level][siblingIndex] || this.getZeroHash(level)
        : this.tree[level][currentIndex] || this.getZeroHash(level);

      const parentIndex = Math.floor(currentIndex / 2);
      this.tree[level + 1][parentIndex] = await this.hashFunction(left, right);

      currentIndex = parentIndex;
    }
  }

  /**
   * Get the zero hash for a given level
   * These are precomputed zero hashes for empty subtrees
   */
  private getZeroHash(_level: number): bigint {
    // For simplicity, use the same zero value for all levels
    // In production, these should be precomputed
    return this.zeroValue;
  }
}
