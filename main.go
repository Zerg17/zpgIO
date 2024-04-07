package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"
)

const WORLD_SIZE = 64
var world [WORLD_SIZE][WORLD_SIZE]int

type chunk_t struct {
    X, Y int
    Size int
    Blocks [WORLD_SIZE][WORLD_SIZE]int
    Temp [WORLD_SIZE][WORLD_SIZE]float32
}

func generateWorld() {
    for i := 0; i < WORLD_SIZE; i++ {
        for j := 0; j < WORLD_SIZE; j++ {
        world[i][j] = rand.Intn(4)
        }
    }
}

func worldProc() {
    for {
        world[rand.Intn(WORLD_SIZE)][rand.Intn(WORLD_SIZE)] = 0
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
    if r.URL.Path == "/json/map" {
        chunk := chunk_t{
            X: 0,
            Y: 0,
            Size: WORLD_SIZE,
            Blocks: world,
            Temp: [64][64]float32{},
        }
        jsonData, err := json.Marshal(chunk)
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