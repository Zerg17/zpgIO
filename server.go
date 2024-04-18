package main

import (
    "compress/gzip"
    "encoding/json"
    "fmt"
    "net/http"
    "os"
    "strconv"
    "strings"
)

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

func sendJson(w http.ResponseWriter, data interface{}) {
    jsonData, err := json.Marshal(data)
    if err != nil {
        fmt.Fprintf(w, "Error: %v", err)
    } else {
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("Content-Encoding", "gzip")
        gz := gzip.NewWriter(w)
        defer gz.Close()
        gz.Write(jsonData)
    }
}

func (app *App) handlerJson(w http.ResponseWriter, r *http.Request) {
    parts := strings.Split(r.URL.Path, "/")

    if len(parts) == 6 && parts[2] == "chunk" {
        x, errX := strconv.Atoi(parts[3])
        y, errY := strconv.Atoi(parts[4])

        if errX == nil && errY == nil {
            if v, ok := app.world.getChunk(x, y); ok {
                sendJson(w, struct{
                    X int `json:"x"`
                    Y int `json:"y"`
                    Blocks [CHUNK_SIZE][CHUNK_SIZE]int `json:"blocks"`
                }{
                    X: x,
                    Y: y,
                    Blocks: v.blocks,
                })
            } else {
                w.WriteHeader(http.StatusNotFound)
            }
        } else {
            w.WriteHeader(http.StatusNotFound)
        }

        return
    }

    if len(parts) == 4 && parts[2] == "bots" {
        type tmpBotSensors_t struct {
            BatU float32 `json:"batU"`
            Temp float32 `json:"temp"`
        }

        type tmpBot_t struct {
            X     int     `json:"x"`
            Y     int     `json:"y"`
            Name  string  `json:"name"`
            Color string  `json:"color"`
            Sensors tmpBotSensors_t `json:"sensors"`
        }

        s := make([]tmpBot_t, len(app.world.bots))

        for i, v := range app.world.bots {
            s[i] = tmpBot_t{
                X:     v.x,
                Y:     v.y,
                Name:  v.name,
                Color: v.color,
                Sensors: tmpBotSensors_t{
                    BatU: v.sensors.batU,
                    Temp: v.sensors.temp,
                },
            }
        }

        sendJson(w, s)
        return
    }

    w.WriteHeader(http.StatusNotFound)
}
