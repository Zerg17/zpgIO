package main

import (
    "fmt"
    "net/http"
)

type App struct {
    world *world_t
}

func main() {
    app := &App{
        world: &world_t{
            chunks: make(map[xy]chunk_t),
            bots:   make([]bot_t, 0),
        },
    }

    app.world.generateWorld(5)

    app.world.addBot(-1, 0, "zerg17", "blue")
    app.world.addBot(1, 0, "yayayat", "orange")

    http.HandleFunc("/", handlerStatic)
    http.HandleFunc("/json/", app.handlerJson)

    go app.world.proc()

    fmt.Println("Server started")
    http.ListenAndServe(":80", nil)
}
