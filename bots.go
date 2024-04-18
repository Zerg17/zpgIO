package main

type botSensors_t struct {
    batU float32
    temp float32
}

type bot_t struct {
    x, y int
    name string
    color string
    sensors botSensors_t
}
