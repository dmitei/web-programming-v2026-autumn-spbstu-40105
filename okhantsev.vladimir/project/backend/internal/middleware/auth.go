package middleware

import (
	"encoding/json"
	"net/http"

	"github.com/P3rCh1/web-project/backend/internal/auth"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

// RequireAuth guards handlers that require an active session.
// It implements server.ServerInterface and delegates unprotected
// endpoints to the wrapped implementation.
type RequireAuth struct {
	next server.ServerInterface
}

func NewRequireAuth(next server.ServerInterface) *RequireAuth {
	return &RequireAuth{next: next}
}

func (m *RequireAuth) unauthorized(w http.ResponseWriter) {
	message := "unauthorized"
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_ = json.NewEncoder(w).Encode(server.Error{Message: &message})
}

func (m *RequireAuth) Login(w http.ResponseWriter, r *http.Request) {
	m.next.Login(w, r)
}

func (m *RequireAuth) Logout(w http.ResponseWriter, r *http.Request) {
	m.next.Logout(w, r)
}

func (m *RequireAuth) GetGoods(w http.ResponseWriter, r *http.Request) {
	m.next.GetGoods(w, r)
}

func (m *RequireAuth) GetOrders(w http.ResponseWriter, r *http.Request) {
	if !auth.Authenticated(r) {
		m.unauthorized(w)
		return
	}
	m.next.GetOrders(w, r)
}

func (m *RequireAuth) CreateOrder(w http.ResponseWriter, r *http.Request) {
	if !auth.Authenticated(r) {
		m.unauthorized(w)
		return
	}
	m.next.CreateOrder(w, r)
}
