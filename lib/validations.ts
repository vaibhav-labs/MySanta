import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  anniversary: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), "Invalid date"),
  gender: z.enum(["male", "female", "other"]).default("other"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const listSchema = z.object({
  name: z.string().min(1, "List name is required"),
  eventId: z.string().optional(),
})

export const listItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productUrl: z.string().url("Invalid URL"),
  imageUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  price: z.number().min(0).optional().or(z.null()),
  currency: z.string().default("USD"),
  variants: z.string().optional().or(z.literal("")).or(z.null()),
  platform: z.string().min(1, "Platform is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
})

export const updateListItemSchema = z.object({
  productName: z.string().min(1, "Product name is required").optional(),
  productUrl: z.string().url("Invalid URL").optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  variants: z.string().optional(),
  platform: z.string().min(1, "Platform is required").optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  status: z.enum(["WISHED", "ON_HOLD", "PURCHASED", "RECEIVED", "BOUGHT_SELF", "REMOVED"]).optional(),
})

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  occasion: z.string().min(1, "Occasion is required"),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  description: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().optional(),
  anniversary: z.union([z.string(), z.null(), z.undefined()]).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
})

export const scrapeSchema = z.object({
  url: z.string().url("Invalid URL"),
})

export const friendRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const friendshipActionSchema = z.object({
  action: z.enum(["accept", "decline", "block"]),
})

export const socialActivitySchema = z.object({
  activityType: z.enum(["NEW_LIST", "NEW_EVENT", "LIST_UPDATE"]),
  entityType: z.enum(["LIST", "EVENT"]),
  entityId: z.string().min(1, "Entity ID is required"),
  entityName: z.string().min(1, "Entity name is required"),
})