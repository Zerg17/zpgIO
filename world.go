package main

import (
	"math/rand"
	"time"

	"github.com/KEINOS/go-noise"
)

const WORLD_SIZE = 1
const CHUNK_SIZE = 64

type block_t struct {
	Type int
	Temp float32
}

type chunk_t struct {
	X, Y   int
	Size   int
	Blocks [CHUNK_SIZE][CHUNK_SIZE]block_t
}

var world [WORLD_SIZE][WORLD_SIZE]chunk_t

func generateWorld() {
	n1, _ := noise.New(noise.OpenSimplex, rand.Int63())
	n2, _ := noise.New(noise.OpenSimplex, rand.Int63())
	n3, _ := noise.New(noise.OpenSimplex, rand.Int63())
	n4, _ := noise.New(noise.OpenSimplex, rand.Int63())

	for i := 0; i < CHUNK_SIZE; i++ {
		for j := 0; j < CHUNK_SIZE; j++ {
			v1 := (n1.Eval64(float64(i)/10, float64(j)/10) + 1) / 2
			v2 := (n2.Eval64(float64(i)/4, float64(j)/4) + 1) / 2
			v3 := (n3.Eval64(float64(i)/5, float64(j)/5) + 1) / 2
			v4 := (n4.Eval64(float64(i)/2, float64(j)/2) + 1) / 2

			if (CHUNK_SIZE/2-i)*(CHUNK_SIZE/2-i)+(CHUNK_SIZE/2-j)*(CHUNK_SIZE/2-j) < 100 {
				world[0][0].Blocks[i][j].Type = 0
			} else {
				switch {
				case v1 > 0.5 && v2 > 0.8:
					world[0][0].Blocks[i][j].Type = 2
				case v1 > 0.5 && v3 > 0.7:
					world[0][0].Blocks[i][j].Type = 3
				case v1 > 0.5 && v4 > 0.9:
					world[0][0].Blocks[i][j].Type = 4
				case v1 > 0.5:
					world[0][0].Blocks[i][j].Type = 1
				}
			}
		}
	}
}

func worldProc() {
    for {
        time.Sleep(500 * time.Millisecond)
    }
}