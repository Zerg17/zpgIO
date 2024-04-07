package main

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
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
    X, Y int
    Size int
    Blocks [CHUNK_SIZE][CHUNK_SIZE]block_t
}

var world [WORLD_SIZE][WORLD_SIZE]chunk_t

func generateWorld() {
    n, _ := noise.New(noise.OpenSimplex, rand.Int63())
    for i := 0; i < CHUNK_SIZE; i++ {
        for j := 0; j < CHUNK_SIZE; j++ {
            if((CHUNK_SIZE / 2 - i) * (CHUNK_SIZE / 2 - i) + (CHUNK_SIZE / 2 - j) * (CHUNK_SIZE / 2 - j) < 100) {
                world[0][0].Blocks[i][j].Type = 0
            } else {
                v := (n.Eval64(float64(i)/10, float64(j)/10) + 1) / 2
                switch {
                    case v > 0.9: world[0][0].Blocks[i][j].Type = 3
                    case v > 0.7: world[0][0].Blocks[i][j].Type = 2
                    case v > 0.4: world[0][0].Blocks[i][j].Type = 1
                    default: world[0][0].Blocks[i][j].Type = 0
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

func main() {
    generateWorld()
    go worldProc()

    http.HandleFunc("/", handlerStatic)
    http.HandleFunc("/json/", handlerJson)

    fmt.Println("Server started")
    http.ListenAndServe(":80", nil)
}

func handlerStatic(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/" {
        http.ServeFile(w, r, "./web/index.htm")
        return
    }

    path := "./web/" + r.URL.Path
    if _, err := os.Stat(path); !os.IsNotExist(err) {
        http.ServeFile(w, r, path)
        return
    }

    w.WriteHeader(http.StatusNotFound)
}

func handlerJson(w http.ResponseWriter, r *http.Request) {
    fmt.Println(r.URL.Path)
    if r.URL.Path == "/json/chunk/" {
        jsonData, err := json.Marshal(world[0][0])
        if err != nil {
            fmt.Fprintf(w, "Error: %v", err)
        } else {
            w.Header().Set("Content-Type", "application/json")
            w.Header().Set("Content-Encoding", "gzip")
            gz := gzip.NewWriter(w)
            defer gz.Close()
            gz.Write(jsonData)
        }
        return
    }

    w.WriteHeader(http.StatusNotFound)
}

