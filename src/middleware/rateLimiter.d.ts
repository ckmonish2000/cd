interface IMemoryStoreValue {
	count: number
	expiry: number
}

export type MemoryStoreType = {
	[key: string]: IMemoryStoreValue
}
