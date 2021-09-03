package errors

import "fmt"

type Guess460CustomError struct {
	Code int
	Message string
}

func (e Guess460CustomError) Error() string {
	return fmt.Sprintf("%s (%d)",  e.Message, e.Code)
}

func NewGuess460CustomError(code int, message string) Guess460CustomError {
	return Guess460CustomError{
		Code: code, Message: message,
	}
}