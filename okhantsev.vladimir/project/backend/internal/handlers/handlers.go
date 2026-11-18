package handlers

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/P3rCh1/web-project/backend/internal/logger"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

type Handlers struct {
	ordersMu sync.RWMutex
}

func New() *Handlers { return &Handlers{} }

func (h *Handlers) JSON(w http.ResponseWriter, v any, code int) {
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		logger.Log.Error(
			"failed to send response",
			"error", err,
		)
	}
}

func (h *Handlers) Error(w http.ResponseWriter, msg string, code int) {
	h.JSON(w, server.Error{Message: &msg}, code)
}
