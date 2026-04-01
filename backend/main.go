package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

type User struct {
	Name                    string  `json:"name"`
	UserCreateDate          string  `json:"userCreateDate"`
	PasswordChangedDate     string  `json:"passwordChangedDate"`
	DaysSincePasswordChange int     `json:"daysSincePasswordChange"`
	LastAccessDate          string  `json:"lastAccessDate"`
	DaysSinceLastAccess     int     `json:"daysSinceLastAccess"`
	MFAEnabled              bool    `json:"mfaEnabled"`
	PasswordStale           bool    `json:"passwordStale"`
	AccessStale             bool    `json:"accessStale"`
}

type RawUser struct {
	Name                string
	UserCreateDate      string
	PasswordChangedDate string
	LastAccessDate      string
	MFAEnabled          bool
}

var rawUsers = []RawUser{
	{"Foo Bar1", "Oct 1 2020", "Oct 1 2021", "Jan 4 2025", true},
	{"Foo1 Bar1", "Sep 20 2019", "Sep 22 2019", "Feb 8 2025", false},
	{"Foo2 Bar2", "Feb 3 2022", "Feb 3 2022", "Feb 12 2025", false},
	{"Foo3 Bar3", "Mar 7 2023", "Mar 10 2023", "Jan 3 2022", true},
	{"Foo Bar4", "Apr 8 2018", "Apr 12 2020", "Oct 4 2022", false},
	{"Human1", "Apr 8 2018", "Sep 8 2025", "Jan 3 2025", true},
	{"Human2", "Apr 8 2018", "Sep 8 2023", "May 3 2025", false},
	{"Human3", "Apr 8 2025", "May 8 2025", "May 23 2025", true},
}

func parseDate(s string) time.Time {
	formats := []string{"Jan 2 2006", "Jan 2, 2006"}
	for _, f := range formats {
		t, err := time.Parse(f, s)
		if err == nil {
			return t
		}
	}
	log.Printf("failed to parse date: %s", s)
	return time.Time{}
}

func daysSince(t time.Time) int {
	return int(time.Since(t).Hours() / 24)
}

func computeUsers() []User {
	users := make([]User, len(rawUsers))
	for i, r := range rawUsers {
		pwDate := parseDate(r.PasswordChangedDate)
		accessDate := parseDate(r.LastAccessDate)
		daysPw := daysSince(pwDate)
		daysAccess := daysSince(accessDate)

		users[i] = User{
			Name:                    r.Name,
			UserCreateDate:          r.UserCreateDate,
			PasswordChangedDate:     r.PasswordChangedDate,
			DaysSincePasswordChange: daysPw,
			LastAccessDate:          r.LastAccessDate,
			DaysSinceLastAccess:     daysAccess,
			MFAEnabled:              r.MFAEnabled,
			PasswordStale:           daysPw > 365,
			AccessStale:             daysAccess > 90,
		}
	}
	return users
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	users := computeUsers()

	// Optional filtering via query params
	mfaFilter := r.URL.Query().Get("mfa")       // "true" or "false"
	staleFilter := r.URL.Query().Get("stale")   // "password" or "access"

	filtered := []User{}
	for _, u := range users {
		if mfaFilter != "" {
			want := strings.ToLower(mfaFilter) == "true"
			if u.MFAEnabled != want {
				continue
			}
		}
		if staleFilter == "password" && !u.PasswordStale {
			continue
		}
		if staleFilter == "access" && !u.AccessStale {
			continue
		}
		filtered = append(filtered, u)
	}

	json.NewEncoder(w).Encode(filtered)
}

func main() {
	http.HandleFunc("/api/users", usersHandler)
	log.Println("Go server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
