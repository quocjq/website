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
  day: string
}

export interface TocEntry {
  level: number
  title: string
  slug: string
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
  toc: TocEntry[]
}

export interface GraphNode {
  id: string
  title: string
  filename: string
  day: string
}

export interface GraphEdge {
  from: string
  to: string
  kind: string
}

export interface NoteGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface DocMeta {
  id: string
  title: string
  updatedAt: string
}
