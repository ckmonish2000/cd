import { PrismaClient } from "@prisma/client"
import redis from "redis"

export const prisma = new PrismaClient({})
export const cache = redis.createClient({})
