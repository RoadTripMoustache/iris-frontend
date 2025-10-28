// Types derived from the OpenAPI contract
export type IdeaTag = 'bug' | 'enhancement'

export interface Comment {
  id: string
  created_at: string
  user_id: string
  message: string
  images?: string[]
}

export interface GetIdeasResponse {
    links: {
        first: string
        previous: string
        self: string
        next: string
        last: string
        has_more: boolean
    }
    data: Idea[]
}

export interface Idea {
  id: string
  created_at: string
  title: string
  description: string
  tag: IdeaTag
  creator_id: string
  votes_count: number
  voters: string[]
  comments: Comment[]
  images: string[]
  is_open: boolean
  user_has_voted?: boolean
}

export interface CreateIdeaRequest {
  title: string
  tag: IdeaTag
  description: string
  images?: string[]
  is_open?: boolean
}

export interface SetIdeaOpenRequest { is_open: boolean }
export interface AddCommentRequest { message: string; images?: string[] }

export interface EnhancedError {
  error_code: string
  error_message?: string
  error_http_code?: number
  details?: any
}

export interface Configs {
    max_images_per_idea: number
    max_images_per_comment: number
    max_size: number
    accepted_extensions: string[]
}