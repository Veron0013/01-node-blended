import { HttpError } from "http-errors"

export const errorHandler = (err, req, res, _next) => {

	if (err instanceof HttpError) {
		return res.status(err.status).json({ message: err.message })
	}
	return res.status(500).json({ message: err.message })
}