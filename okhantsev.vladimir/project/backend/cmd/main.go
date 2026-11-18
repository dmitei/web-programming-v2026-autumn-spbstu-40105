package main

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"github.com/P3rCh1/web-project/backend/internal/handlers"
	"github.com/P3rCh1/web-project/backend/internal/logger"
	"github.com/P3rCh1/web-project/backend/internal/middleware"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

func main() {
	h := middleware.NewRequireAuth(handlers.New())

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}))
	r.Mount("/", server.Handler(h))

	logger.Log.Info("backend is running on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		if !errors.Is(err, http.ErrServerClosed) {
			logger.Log.Error("server stoped with error", "error", err)
		}
	}
}
