
type SuccessUserCreationResult = {
    success: true
    id:string
}

type FailedUserCreationResult = {
    success: false
    error: string
    errorCode:string
}
    
export type UserCreationResult = SuccessUserCreationResult | FailedUserCreationResult
