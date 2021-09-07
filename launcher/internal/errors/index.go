package errors

import "fmt"

type CustomError struct {
	Code int
	Message string
}

func (e CustomError) Error() string {
	return fmt.Sprintf("%s (%d)",  e.Message, e.Code)
}

func NewCustomError(code int, message string) CustomError {
	return CustomError{
		Code: code, Message: message,
	}
}
func NewCustomErrorWithAddonMessage(code int, message string) func(message string) CustomError {
	return func(addonMessage string) CustomError {
		return NewCustomError(code, message + ":" + addonMessage)
	}
}