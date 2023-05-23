import { PrismaClient } from "@prisma/client"
import {createClient} from "redis"
import config from "config"

const redisHost = config.get<string>("redisHost")
const redisPort = config.get<string>("redisPort")

export const prisma = new PrismaClient({})

export const cache = createClient({
	url:`redis://${redisHost}:${redisPort}`
})
