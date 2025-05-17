import axios from 'axios'
import { PostRequest, ResponsePost, TLoginUser, TRegistrationUser, UpdatePostRequest } from './types'

export const Registration = async(data: TRegistrationUser) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/account/create`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const Login = async(data: TLoginUser) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/account/login`, data, {
            headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }})
        if (response.status === 200) {
            console.log(response)
            localStorage.setItem('jwtToken', response.data.jwtToken)
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const Logout = async() => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

/* export const GetProfile = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
} */

export const POSTPost = async(data: PostRequest) => {
    try {
        const response = await axios.post<ResponsePost>(`${import.meta.env.VITE_BACKEND_URL}/post/create`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if(response.status === 200) {
            return response.data
        }
    } catch (error) {
        console.warn(error)
    }
}

export const GetAllPosts = async(username?: string, createdAt?: string, page?: number, limit?: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/list`, {
            params: {
                username,
                createdAt,
                page,
                limit
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const GetUserPosts = async(id: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}/posts`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const GetMyPosts = async() => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/my-posts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const PostNewPost = async() => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const UpdatePost = async(data: UpdatePostRequest) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/post/update`, {
            uuid: data.uuid,
            title: data.title,
            content: data.content
        }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export const DeletePost = async(uuid: string) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/post/delete`, { uuid }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        })
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}