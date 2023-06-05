import createServer from "@utils/server"
import supertest from "supertest"
import { primaryUser, shortcut } from "./mock"
import * as userService from "@services/user.service"
import * as cachUtil from "@utils/cacheHelper"
import * as redirectService from "@services/redirect.service"
import * as analyticsService from "@services/analytics.service"
import { v4 as uuidv4 } from 'uuid';

const app = createServer()
let cookie:string[]

beforeAll(async()=>{
        let login = await supertest(app).post("/api/login").send(primaryUser)
        cookie = login.headers["set-cookie"]
})

describe('Redirect route', () => { 
    describe('Given valid route', () => { 
        it("should return 302",async()=>{
            const userId = uuidv4()
            const setCache = jest.spyOn(cachUtil,"setCache")
            const getCache = jest.spyOn(cachUtil,"getCache")
            const fetchUserById = jest.spyOn(userService,"fetchUserById")
            const fetchShortcutForUser = jest.spyOn(redirectService,"fetchShortcutForUser")
            const addAnalyticLog = jest.spyOn(analyticsService,"addAnalyticLog")

                fetchUserById.mockResolvedValue({
                    id:uuidv4(),
                    email:primaryUser.email,
                    password:primaryUser.password
                })
    
            getCache.mockResolvedValue(null)
            setCache.mockResolvedValue("OK")
    
            fetchShortcutForUser.mockResolvedValue( {
                userId:userId,
                ...shortcut
            })
    
            addAnalyticLog.mockResolvedValue({
                id: uuidv4(),
                shortcutShortlink: shortcut.shortlink,
                shortcutUserId: uuidv4(),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
    
            const res = await supertest(app).get("/api/gom").set("Cookie",cookie)
            
            expect(res.statusCode).toBe(302)
            expect(res.text).toBe("Found. Redirecting to https://google.com")
        })
     })

     describe('Given invalid route', () => { 
        it("should return 404",async()=>{
            const getCache = jest.spyOn(cachUtil,"getCache")
            const fetchUserById = jest.spyOn(userService,"fetchUserById")
            const fetchShortcutForUser = jest.spyOn(redirectService,"fetchShortcutForUser")
            const addAnalyticLog = jest.spyOn(analyticsService,"addAnalyticLog")
            
                fetchUserById.mockResolvedValue({
                    id:uuidv4(),
                    email:primaryUser.email,
                    password:primaryUser.password
                })
            getCache.mockResolvedValue(null)
    
            fetchShortcutForUser.mockResolvedValue(null)
    
            const res = await supertest(app).get("/api/goz").set("Cookie",cookie)
            expect(res.statusCode).toBe(404)
            expect(addAnalyticLog.mock.calls.length).toBe(0)
        })
      })

      describe('Given invalid param', () => {
       
        describe('Given short route param', () => { 
            it("should return 400",async ()=>{
                const fetchUserById = jest.spyOn(userService,"fetchUserById")
                fetchUserById.mockResolvedValue({
                    id:uuidv4(),
                    email:primaryUser.email,
                    password:primaryUser.password
                })
                const res = await supertest(app).get("/api/g").set("Cookie",cookie)

                expect(res.body.length).toBe(1)
                expect(res.body[0].message).toBe("shortcut should atleas be 2 char long")
                expect(res.statusCode).toBe(400)
            })
        })
      })
 })