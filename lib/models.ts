// Types derived from the OpenAPI contract
export type IdeaTag = 'bug' | 'enhancement'

export interface Comment {
  id: string
  created_at: string
  user_id: string
  message: string
  images?: string[]
}

export interface Idea {
  id: string
  created_at: string
  title: string
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
