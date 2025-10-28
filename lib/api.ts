import type {Idea, CreateIdeaRequest, AddCommentRequest, SetIdeaOpenRequest, GetIdeasResponse, Configs} from './models'
import {useAuth} from '~/composables/useAuth'

async function getAuthHeader(): Promise<Record<string, string>> {
    const {getIdToken} = useAuth()
    const token = await getIdToken()
    if (!token) {
        throw new Error('Authentication required: missing Firebase ID token')
    }
    return {Authorization: `Bearer ${token}`}
}

function baseUrl() {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl?.replace(/\/$/, '') || ''
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
        ...(init?.headers || {})
    }
    const res = await fetch(`${baseUrl()}${path}`, {...init, headers})
    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
    }
    return await res.json() as T
}

export const ConfigsApi = {
    get: async (): Promise<Configs> => {
        return http<Configs>('/v1/configs', {method: 'GET'})
    },
}

export const ImagesApi = {
    upload: async (file: File): Promise<{ url: string }> => {
        const form = new FormData()
        form.append('file', file)
        const headers = await getAuthHeader()
        const res = await fetch(`${baseUrl()}/v1/images`, {method: 'POST', headers, body: form})
        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || res.statusText)
        }
        return await res.json() as { url: string }
    },
    delete: async (filename: string): Promise<void> => {
        return http(`/v1/images/${filename}`, {method: 'DELETE'})
    }
}

export const IdeasApi = {
    list: async (pageNumber?: number, pageSize?: number): Promise<GetIdeasResponse> => {
        const params = new URLSearchParams()
        if (pageNumber) params.set('page[number]', String(pageNumber))
        if (pageSize) params.set('page[size]', String(pageSize))
        const qs = params.toString()
        return http<GetIdeasResponse>(`/v1/ideas${qs ? `?${qs}` : ''}`)
    },
    create: async (payload: CreateIdeaRequest): Promise<Idea> => {
        return http<Idea>('/v1/ideas', {method: 'POST', body: JSON.stringify(payload)})
    },
    getOne: async (id: string): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}`, {method: 'GET'})
    },
    vote: async (id: string): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/vote`, {method: 'POST'})
    },
    unvote: async (id: string): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/vote`, {method: 'DELETE'})
    },
    addComment: async (id: string, payload: AddCommentRequest): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/comments`, {method: 'POST', body: JSON.stringify(payload)})
    },
    editComment: async (id: string, commentId: string, payload: AddCommentRequest): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/comments/${commentId}`, {method: 'PATCH', body: JSON.stringify(payload)})
    },
    deleteComment: async (id: string, commentId: string): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/comments/${commentId}`, {method: 'DELETE'})
    },
    setOpen: async (id: string, is_open: boolean): Promise<Idea> => {
        return http<Idea>(`/v1/ideas/${id}/open`, {
            method: 'PATCH',
            body: JSON.stringify({is_open} as SetIdeaOpenRequest)
        })
    }
}
