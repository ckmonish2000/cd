
type SuccessUserCreationResult = {
    success: true
    id:string
    status:number
}

type FailedUserCreationResult = {
    success: false
    error: string
    status:number
}
    
export type UserCreationResult = SuccessUserCreationResult | FailedUserCreationResult
