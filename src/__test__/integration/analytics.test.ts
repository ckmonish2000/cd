import createServer from "@utils/server"
import supertest from "supertest"
import * as analyticsService from "@services/analytics.service"
import * as shortcutService from "@services/shortcut.service"
import { v4 as uuidv4 } from 'uuid';
import { primaryUser, shortcut } from "./mock"

const app = createServer()
let cookie:string[]

beforeAll(async()=>{
        let login = await supertest(app).post("/api/login").send(primaryUser)
        cookie = login.headers["set-cookie"]
})

describe('Analytics route', () => { 
    describe('Given valid route param', () => { 

        it("should return 200",async()=>{
            const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
            const fetchAllLogsForShortcut = jest.spyOn(analyticsService,"fetchAllLogsForShortcut")

            fetchShotcutById.mockResolvedValue({
                userId: uuidv4(),
                ...shortcut
            })

            fetchAllLogsForShortcut.mockResolvedValue({
                _count:[
                    {
                        _count:{
                            userId:28
                        },
                        userId:uuidv4()
                    }
                ]
            })

            const res = await supertest(app)
            .get(`/api/analytics/${shortcut.shortlink}`)
            .set("Cookie",cookie)

            expect(res.statusCode).toBe(200)
        })

    })

    describe('Given valid route param', () => { 

        it("should return 404",async()=>{
            const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
            fetchShotcutById.mockResolvedValue(null)

            const res = await supertest(app)
            .get(`/api/analytics/xxx`)
            .set("Cookie",cookie)

            expect(Array.isArray(res.body)).toBe(false)
            expect(res.statusCode).toBe(404)
        })

    })
 })