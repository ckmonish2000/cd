import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"
import config from "config"

const redisHost = config.get<string>("redisHost")
const redisPort = config.get<string>("redisPort")

export const prisma = new PrismaClient({})

export const cache = new Redis({
	host:redisHost,
	port:parseInt(redisPort),
})