package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestDaysSince(t *testing.T) {
	yesterday := time.Now().AddDate(0, 0, -1)
	days := daysSince(yesterday)
	if days != 1 {
		t.Errorf("expected 1, got %d", days)
	}
}

func TestParseDate(t *testing.T) {
	d := parseDate("Jan 4 2025")
	if d.Year() != 2025 || d.Month() != 1 || d.Day() != 4 {
		t.Errorf("unexpected parsed date: %v", d)
	}
}

func TestComputeUsersLength(t *testing.T) {
	users := computeUsers()
	if len(users) != len(rawUsers) {
		t.Errorf("expected %d users, got %d", len(rawUsers), len(users))
	}
}

func TestComputeUsersPasswordStale(t *testing.T) {
	users := computeUsers()
	for _, u := range users {
		if u.DaysSincePasswordChange > 365 && !u.PasswordStale {
			t.Errorf("user %s should be password stale", u.Name)
		}
		if u.DaysSincePasswordChange <= 365 && u.PasswordStale {
			t.Errorf("user %s should NOT be password stale", u.Name)
		}
	}
}

func TestComputeUsersAccessStale(t *testing.T) {
	users := computeUsers()
	for _, u := range users {
		if u.DaysSinceLastAccess > 90 && !u.AccessStale {
			t.Errorf("user %s should be access stale", u.Name)
		}
	}
}

func TestUsersHandlerReturnsJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/users", nil)
	rec := httptest.NewRecorder()
	usersHandler(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rec.Code)
	}

	var users []User
	if err := json.NewDecoder(rec.Body).Decode(&users); err != nil {
		t.Errorf("failed to decode response: %v", err)
	}
	if len(users) == 0 {
		t.Error("expected non-empty user list")
	}
}

func TestUsersHandlerMFAFilter(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/users?mfa=true", nil)
	rec := httptest.NewRecorder()
	usersHandler(rec, req)

	var users []User
	json.NewDecoder(rec.Body).Decode(&users)
	for _, u := range users {
		if !u.MFAEnabled {
			t.Errorf("user %s should have MFA enabled", u.Name)
		}
	}
}

func TestUsersHandlerPasswordStaleFilter(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/users?stale=password", nil)
	rec := httptest.NewRecorder()
	usersHandler(rec, req)

	var users []User
	json.NewDecoder(rec.Body).Decode(&users)
	for _, u := range users {
		if !u.PasswordStale {
			t.Errorf("user %s should have stale password", u.Name)
		}
	}
}

func TestCORSHeaders(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/users", nil)
	rec := httptest.NewRecorder()
	usersHandler(rec, req)

	if rec.Header().Get("Access-Control-Allow-Origin") != "*" {
		t.Error("expected CORS header")
	}
}
