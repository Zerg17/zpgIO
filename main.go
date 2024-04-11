package main

import (
    "fmt"
    "net/http"
)

func main() {
    bots = make([]bot_t, 0)
    generateWorld()
    bots = append(bots, bot_t{X: 32, Y: 32, Color: "red", BatU: 4.2, Temp: 293})

    go worldProc()

    http.HandleFunc("/", handlerStatic)
    http.HandleFunc("/json/", handlerJson)

    fmt.Println("Server started")
    http.ListenAndServe(":80", nil)
}
