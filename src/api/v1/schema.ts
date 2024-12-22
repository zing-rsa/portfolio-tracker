import Joi from "joi";

export const OnboardValidator = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
})

export const TopUpValidator = Joi.object({
    request_count: Joi.number()
})