package main

import (
    "encoding/json"
    "fmt"
    "math/rand"
    "net/http"
    "os"
)

const WORLD_SIZE = 64
var world [WORLD_SIZE][WORLD_SIZE]int

func generateWorld() {
    for i := 0; i < WORLD_SIZE; i++ {
        for j := 0; j < WORLD_SIZE; j++ {
        world[i][j] = rand.Intn(4)
        }
    }
}

func main() {
    generateWorld()

    http.HandleFunc("/", handlerStatic)
    http.HandleFunc("/json/", handlerJson)
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
        jsonData, err := json.Marshal(world)
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