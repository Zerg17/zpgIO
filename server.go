package main

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
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

func handlerJson(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/json/chunk/":
		sendJson(w, world[0][0])
	case "/json/bots/":
		sendJson(w, bots)
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}
