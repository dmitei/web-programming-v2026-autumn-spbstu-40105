package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/P3rCh1/web-project/backend/internal/auth"
	"github.com/P3rCh1/web-project/backend/internal/logger"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

const usersFile = "users.json"

func (h *Handlers) getUsers() (map[string]string, error) {
	var users map[string]string
	if err := readJSON(usersFile, &users); err != nil {
		return nil, err
	}
	return users, nil
}

func (h *Handlers) Login(w http.ResponseWriter, r *http.Request) {
	users, err := h.getUsers()
	if err != nil {
		logger.Log.Error(
			"failed to get users list",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	var req server.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	password, ok := users[req.Username]
	if !ok || password != req.Password {
		h.Error(
			w,
			"wrong login or password",
			http.StatusUnauthorized,
		)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     auth.SessionCookie,
		Value:    req.Username,
		Path:     "/",
		MaxAge:   60 * 60 * 24,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	h.JSON(w, server.User{Username: req.Username}, http.StatusOK)
}

func (h *Handlers) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     auth.SessionCookie,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	w.WriteHeader(http.StatusOK)
}
