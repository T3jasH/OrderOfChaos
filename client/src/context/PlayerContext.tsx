import React from "react"
import { Player, PlayerAction, playerReducer } from "./PlayerReducer"

const playerDefaultState: Player = {
    score: 200,
    attacks: [],
    attacksLeft: 0,
}

export interface PlayerContextModel {
    state: Player
    dispatch: React.Dispatch<PlayerAction>
}

export const PlayerContext = React.createContext<PlayerContextModel>(
    {} as PlayerContextModel
)

const PlayerProvider: React.FC = ({ children }) => {
    const [state, dispatch] = React.useReducer(
        playerReducer,
        playerDefaultState
    )

    return (
        <PlayerContext.Provider value={{ state, dispatch }}>
            {children}
        </PlayerContext.Provider>
    )
}

export default PlayerProvider
