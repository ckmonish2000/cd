import createServer from "@utils/server"
import supertest from "supertest"
import * as shortcutService from "@services/shortcut.service"
import * as permissionServices from "@services/permission.service"
import * as userService from "@services/user.service"
import * as authService from "@services/auth.service"
import * as authUtils from "@utils/auth"
import { v4 as uuidv4 } from 'uuid';
import { primaryUser, shortcut } from "./mock"

const app = createServer()
let cookie:string[]
const ownerId = uuidv4()

beforeAll(async()=>{
        const checkUserWithEmail = jest.spyOn(authService,"checkUserWithEmail")
        const validatePassword = jest.spyOn(authUtils,"validatePassword")

        checkUserWithEmail.mockResolvedValue({
            id:ownerId,
            email:primaryUser.email,
            password:primaryUser.password
        })

        validatePassword.mockResolvedValue(true)

        let login = await supertest(app).post("/api/login").send(primaryUser)
        cookie = login.headers["set-cookie"]
})


describe('Permission Route', () => { 
    describe('Add user to access list', () => {
        it("should return 201",async()=>{
            const userId = uuidv4()
            const fetchUserById = jest.spyOn(userService,"fetchUserById")
            const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
            const addUserToAccessList =  jest.spyOn(permissionServices,"addUserToAccessList")


            fetchUserById.mockResolvedValue({
                id:ownerId,
                email:primaryUser.email,
                password:primaryUser.password
            })

            fetchShotcutById.mockResolvedValue({
                ...shortcut,
                userId:ownerId
            })

            addUserToAccessList.mockResolvedValue({
                id:uuidv4(),
                shortcutShortlink:shortcut.url,
                shortcutUserId:ownerId,
                userId:userId
            })

            const res = await supertest(app)
            .post("/api/permission")
            .send({
                userId:"c2ffd470-c709-47ba-9d4a-c13a7f209daf",
                shortlink:"google"
            })
            .set("Cookie",cookie)

            expect(res.statusCode).toBe(201)
        })
     })


     describe('Remove user from access list', () => {
        it("should return 200",async()=>{
            const userId = uuidv4()
            const shortcutAccessId = uuidv4()

            const fetchUserById = jest.spyOn(userService,"fetchUserById")
            const fetchAccessListById = jest.spyOn(permissionServices,"fetchAccessListById")
            const removeUserFromAccessList =  jest.spyOn(permissionServices,"removeUserFromAccessList")

            fetchUserById.mockResolvedValue({
                id:ownerId,
                email:primaryUser.email,
                password:primaryUser.password
            })

            fetchAccessListById.mockResolvedValue({
                id:uuidv4(),
                shortcutShortlink:shortcut.url,
                shortcutUserId:ownerId,
                userId:userId
            })

            removeUserFromAccessList.mockResolvedValue({
                id:shortcutAccessId,
                shortcutShortlink:shortcut.url,
                shortcutUserId:ownerId,
                userId:userId
            })

            const res = await supertest(app)
            .delete(`/api/permission/${shortcutAccessId}`)
            .set("Cookie",cookie)

            expect(res.statusCode).toBe(200)
        })
     })

     describe('Get current user\'s access list', () => {
        it("should return 200",async()=>{
            const userId = uuidv4()

            const fetchUserById = jest.spyOn(userService,"fetchUserById")
            const fetchShotcutById = jest.spyOn(shortcutService,"fetchShotcutById")
            const fetchAccessListForUrl = jest.spyOn(permissionServices,"fetchAccessListForUrl")

            fetchUserById.mockResolvedValue({
                id:ownerId,
                email:primaryUser.email,
                password:primaryUser.password
            })

            fetchShotcutById.mockResolvedValue({
                ...shortcut,
                userId:ownerId
            })

            fetchAccessListForUrl.mockResolvedValue([
                {
                    "id": uuidv4(),
                    "userId": userId,
                    "shortcutShortlink": shortcut.shortlink,
                    "shortcutUserId": ownerId
                }
            ])
           
            const res = await supertest(app)
            .get(`/api/permission/${shortcut.shortlink}`)
            .set("Cookie",cookie)

            expect(res.statusCode).toBe(200)
        })
     })
 })