package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"
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
    for i := 0; i < WORLD_SIZE; i++ {
        for j := 0; j < WORLD_SIZE; j++ {
            world[0][0].Blocks[i][j].Type = rand.Intn(4)
        }
    }
}

func worldProc() {
    for {
        world[0][0].Blocks[rand.Intn(WORLD_SIZE)][rand.Intn(WORLD_SIZE)].Type = 0
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
    if r.URL.Path == "/json/chunk" {
        jsonData, err := json.Marshal(world[0][0])
        if err != nil {
            fmt.Fprintf(w, "Error: %v", err)
        } else {
            w.Header().Set("Content-Type", "application/json")
            w.Write(jsonData)
        }
        return
    }

    w.WriteHeader(http.StatusNotFound)
}
