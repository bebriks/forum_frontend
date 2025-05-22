export type ResponsePost = {
    status: number
    data: {
        id: string
        userId: string
        textMessage: string
        data: Date
    }
}

export type Post = {
    content: string
    createdAt: string
    title: string
    updatedAt: null | string
    uuid: string
    username: string
}

export type Posts = {
    items: Post[],
}

export type PostResponse = {
    items: Post[],
    pagination : {
        currentPage: number
        totalItems: number
        totalPages: number
    }
} | null

export type PostRequest = {
    title: string
    content: string
}

export type UpdatePostRequest = {
    uuid: string
    title: string
    content: string
}

export type TUser = {
    jwtToken: string
    refreshtoken: string
    username: string
} | null

export type TRegistrationUser = {
    username: string
    password: string
}

export type TLoginUser = {
    username: string
    password: string
}