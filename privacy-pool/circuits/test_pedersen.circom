pragma circom 2.1.2;

include "node_modules/circomlib/circuits/bitify.circom";
include "node_modules/circomlib/circuits/pedersen.circom";

// Minimal circuit to test Pedersen hash XY coordinates
template PedXY248() {
    signal input a;                 // 0..2^248-1
    signal output X;
    signal output Y;

    component bits = Num2Bits(248);
    bits.in <== a;                  // LSB-first

    component ped = Pedersen(248);  // Output is Baby Jubjub point
    for (var i = 0; i < 248; i++) {
        ped.in[i] <== bits.out[i];
    }

    X <== ped.out[0];               // X coordinate
    Y <== ped.out[1];               // Y coordinate
}

component main = PedXY248();