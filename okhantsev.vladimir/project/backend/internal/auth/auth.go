package auth

import "net/http"

const SessionCookie = "session"

func Authenticated(r *http.Request) bool {
	cookie, err := r.Cookie(SessionCookie)
	return err == nil && cookie.Value != ""
}
