export type TopicId =
  | 'kubernetes'
  | 'golang'
  | 'terraform'
  | 'python'
  | 'bash'
  | 'git'
  | 'grafana'
  | 'aws'
  | 'helm'
  | 'argocd'
  | 'cicd'
  | 'autoscaling'
  | 'ansible'

export interface Topic {
  id: TopicId
  name: string
  bgClass: string      // e.g. "bg-blue-600"
  textClass: string    // e.g. "text-blue-100"
  borderClass: string  // e.g. "border-blue-600"
  icon: string
  description: string
}

export type ResourceType = 'docs' | 'video' | 'article' | 'github' | 'book'

export interface Resource {
  title: string
  url: string
  type: ResourceType
}

export interface Exercise {
  description: string
  steps: string[]
  answerHint?: string
  answer: string
}

export interface DayEntry {
  dayNumber: number
  topicId: TopicId
  title: string
  theoryReading: Resource[]
  exercise: Exercise
  weekInRotation: 1 | 2
  dayInRotation: 1 | 2 | 3 | 4 | 5 | 6 | 7
}
