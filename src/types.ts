export interface NoteMeta {
  id: string
  filename: string
  relPath: string
  folder: string
  title: string
  date: string
  tags: string[]
  public: boolean
  updatedAt: number
}

export interface StoredNote {
  id: string
  meta: {
    id: string
    filename: string
    title: string
    date: string
    public: boolean
    tags: string[]
  }
  html: string
}

export interface DocMeta {
  id: string
  title: string
  updatedAt: string
}
