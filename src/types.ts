export type Category = 'verbs' | 'adjectives' | 'adverbs'

export type CardData = {
    hebrew: string
    russian: string
}

export type TestAttempt = {
    percent: number
    correct: number
    total: number
    date: string
}

export type TestStats = {
    [category in Category]?: {
        [level: number]: TestAttempt[]
    }
}