export interface attack {
    username: string
    date: Date
    seen: boolean
}

export interface Player {
    score: number
    attacksLeft: number
    attacks: attack[]
}

export enum PlayerActionTypes {
    UPDATE_SCORE = "UPDATE_SCORE",
    UPDATE_ATTACKS_LEFT = "UPDATE_ATTACKS_LEFT",
    UPDATE_ATTACKS = "UPDATE_ATTACKS",
    GET_USER = "GET_USER",
    SET_SEEN = "SET_SEEN",
}

export interface PlayerAction {
    type: PlayerActionTypes
    payload: any
}

export const playerReducer = (state: Player, action: PlayerAction) => {
    switch (action.type) {
        case "GET_USER":
            return {
                ...state,
                score: action.payload.score,
                attacksLeft: action.payload.attacksLeft,
                attacks: action.payload.attacks,
            }
        case "UPDATE_ATTACKS_LEFT":
            return {
                ...state,
                attacksLeft: action.payload.attacksLeft,
            }
        case "UPDATE_ATTACKS":
            return {
                ...state,
                attacksLeft: action.payload.attacks,
            }
        case "UPDATE_SCORE":
            return {
                ...state,
                score: action.payload.score,
            }
        case "SET_SEEN":
            let attacks = state.attacks
            for (var i = 0; i < attacks.length; i++) {
                attacks[i].seen = true
            }
            return {
                ...state,
                attacks,
            }
        default:
            return state
    }
}
