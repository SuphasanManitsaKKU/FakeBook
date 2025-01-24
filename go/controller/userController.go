package controller

import "github.com/gofiber/fiber/v2"

type UserController interface {
	GetUser() func(c *fiber.Ctx) error
	SetUser() func(c *fiber.Ctx) error
}


type userController struct {

}

func NewUserController() UserController {
	return &userController{}
}

func (u *userController) GetUser() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	}
}

func (u *userController) SetUser() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	}
}