package main

import (
    "math/rand"
    "time"

    "github.com/KEINOS/go-noise"
)

const CHUNK_SIZE = 16

type chunk_t struct {
    x, y   int
    size   int
    blocks [CHUNK_SIZE][CHUNK_SIZE]int
    temp [CHUNK_SIZE][CHUNK_SIZE]float32
}

type xy struct {
    x int
    y int
}

type world_t struct {
    chunks map[xy]chunk_t
    bots   []bot_t
    rand [4]int64
}

func (w *world_t) addChunk(x, y int) {
    c := chunk_t{
        x: x,
        y: y,
        size: CHUNK_SIZE,
        blocks: [CHUNK_SIZE][CHUNK_SIZE]int{},
        temp: [CHUNK_SIZE][CHUNK_SIZE]float32{},
    }

    n1, _ := noise.New(noise.OpenSimplex, w.rand[0])
    n2, _ := noise.New(noise.OpenSimplex, w.rand[1])
    n3, _ := noise.New(noise.OpenSimplex, w.rand[2])
    n4, _ := noise.New(noise.OpenSimplex, w.rand[3])

    for i := 0; i < CHUNK_SIZE; i++ {
        for j := 0; j < CHUNK_SIZE; j++ {
            v1 := (n1.Eval64(float64(i + x * CHUNK_SIZE) / 10, float64(j + y * CHUNK_SIZE) / 10) + 1) / 2
            v2 := (n2.Eval64(float64(i + x * CHUNK_SIZE) / 4, float64(j + y * CHUNK_SIZE) / 4) + 1) / 2
            v3 := (n3.Eval64(float64(i + x * CHUNK_SIZE) / 5, float64(j + y * CHUNK_SIZE) / 5) + 1) / 2
            v4 := (n4.Eval64(float64(i + x * CHUNK_SIZE) / 2, float64(j + y * CHUNK_SIZE) / 2) + 1) / 2

            var b int = 0

            if (CHUNK_SIZE / 2 - (i + x * CHUNK_SIZE)) *
                (CHUNK_SIZE / 2 - (i + x * CHUNK_SIZE)) +
                (CHUNK_SIZE / 2 - (j + y * CHUNK_SIZE)) *
                (CHUNK_SIZE / 2 - (j + y * CHUNK_SIZE)) > 100 {
                switch {
                    case v1 > 0.5 && v2 > 0.8:
                        c.blocks[i][j] = 2
                    case v1 > 0.5 && v3 > 0.7:
                        c.blocks[i][j] = 3
                    case v1 > 0.5 && v4 > 0.9:
                        c.blocks[i][j] = 4
                    case v1 > 0.5:
                        c.blocks[i][j] = 1
                }
            }

            c.blocks[i][j] = b
        }
    }

    w.chunks[xy{x, y}] = c
}

func (w *world_t) generateWorld(size int) {
    if size <= 0 {
        return
    }

    w.rand = [4]int64{rand.Int63(), rand.Int63(), rand.Int63(), rand.Int63()}

    for i := -(size - 1) / 2; i <= size / 2; i++ {
        for j := -(size - 1) / 2; j <= size / 2; j++ {
            w.addChunk(i, j)
        }
    }
}

func (w *world_t) getChunk(x, y int) (chunk_t, bool) {
    c, ok := w.chunks[xy{x, y}]
    return c, ok
}

func (w *world_t) addBot(x, y int, name string, color string) {
    w.bots = append(w.bots, bot_t{x: x, y: y, name: name, color: color, batU: 4.2, temp: 293})
}

func (w *world_t) proc() {
    for {
        time.Sleep(500 * time.Millisecond)
    }
}
