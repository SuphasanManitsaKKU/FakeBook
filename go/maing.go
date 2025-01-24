package main

import (
	"test/controller"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	userController := controller.NewUserController()

	app.Get("/", userController.GetUser())
	app.Post("/", userController.SetUser())

	app.Listen(":3000")

}