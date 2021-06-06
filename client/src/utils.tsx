import { AuthActionTypes } from "./context/AuthReducer"
import { attack, PlayerActionTypes } from "./context/PlayerReducer"
import { QuestionActionTypes } from "./context/QuestionReducer"
import { IleaderboardPlayer } from "./Pages/LeaderboardPage"
import React, { useContext } from "react"
import { AuthContext } from "./context/AuthContext"

export const getContestDetails = async (
    auth: any,
    questions: any,
    player: any
) => {
    fetch("/api/contest", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": auth.state.token,
        },
    })
        .then((resp) => {
            if (resp.status === 401) {
                auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] })
            }
            return resp.json()
        })
        .catch((err) => console.log(err))
        .then((data) => {
            if (data.success === false) {
                if (data.isStarted === false) {
                    auth.dispatch({
                        type: AuthActionTypes.NOT_STARTED,
                        payload: [],
                    })
                } else if (data.iperror === true) {
                    auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: {} })
                    auth.dispatch({
                        type: AuthActionTypes.SET_MESSAGE,
                        payload: {
                            type: "fail",
                            msg:
                                "Connection from only one IP allowed. Contact us",
                        },
                    })
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3500)
                }
                return
            }
            // console.log("LOGGING CONTEST DATA:")
            questions.dispatch({
                type: QuestionActionTypes.GET_QUESTIONS,
                payload: data.data.questions,
            })
            auth.dispatch({
                type: AuthActionTypes.GET_AUTH,
                payload: {
                    isStarted: data.data.isStarted,
                    isEnded: data.data.isEnded,
                    isAdmin: data.data.user.isAdmin,
                    id: data.data.user._id.toString(),
                    username: data.data.user.username,
                },
            })
            player.dispatch({
                type: PlayerActionTypes.GET_USER,
                payload: {
                    score: data.data.user.score,
                    attacks: data.data.user.attackers,
                    attacksLeft: data.data.user.remAttack,
                },
            })
            // console.log("FETCHED CONTEST DETAILS")
        })
}

export const getUser = async (auth: any, player?: any) => {
    let resp = null
    if (auth.state.token) {
        resp = await fetch("/api/auth", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": auth.state.token,
            },
        })
        if (resp.status === 401) {
            auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] })
            return
        }
        const data = await resp.json()
        if (data.success === false) {
            if (data.isStarted === false) {
                auth.dispatch({
                    type: AuthActionTypes.NOT_STARTED,
                    payload: [],
                })
            } else if (data.iperror === true) {
                auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: {} })
                auth.dispatch({
                    type: AuthActionTypes.SET_MESSAGE,
                    payload: {
                        type: "fail",
                        msg: "Connection from only one IP allowed. Contact us",
                    },
                })
                setTimeout(() => {
                    auth.dispatch({
                        type: AuthActionTypes.CLEAR_MESSAGE,
                        payload: {},
                    })
                }, 3500)
            }
            return null
        }
        auth.dispatch({
            type: AuthActionTypes.GET_AUTH,
            payload: {
                id: data.data.user._id,
                isAdmin: data.data.user.isAdmin,
                isStarted: data.data.isStarted,
                isEnded: data.data.isEnded,
                username: data.data.user.username,
            },
        })
        if (player) {
            player.dispatch({
                type: PlayerActionTypes.GET_USER,
                payload: {
                    score: data.data.user.score,
                    attacks: data.data.user.attackers,
                    attacksLeft: data.data.user.remAttack,
                },
            })
        }
        return data
    }
    return { success: false }
}

export const getLeaderboard = async (auth: any) => {
    const resp = await fetch("/api/leaderboard", {
        method: "GET",
        headers: {
            "x-auth-token": auth.state.token,
            "Content-type": "application/json",
        },
    })
    if (resp.status === 401) {
        auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] })
        return
    }
    const data = await resp.json()
    // console.log(data)
        return {
            ...data.data,
            playerRank:
                data.data.ranks.findIndex(
                    (user: any) => user._id === auth.state.id
                ) + 1,
        }
    
}

// To get count of attacks, from another player on current player
export const getAttackersCount = (
    attackers: attack[],
    leaderboardPlayer: any
) => {
    let cnt = 0
    if (attackers.length) {
        attackers.map((attacker: attack) => {
            if (attacker.username === leaderboardPlayer.username) {
                cnt += 1
            }
            return null
        })
    }
    return cnt
}

export const sortAttackers = (
    leaderboardPlayers: IleaderboardPlayer[],
    auth: any
) => {
    var att: any = null
    att = leaderboardPlayers?.find((player) => player._id === auth.state.id)
        ?.attackers
    att = att?.map((obj: any) => {
        let newObj = obj
        newObj.date = Date.parse(obj.date)
        if (leaderboardPlayers?.length) {
            var idx = leaderboardPlayers?.findIndex(
                (player) => player.username === obj.username
            )
            newObj.rank = idx + 1
            newObj.score = leaderboardPlayers[idx].score
            newObj._id = leaderboardPlayers[idx]._id
            newObj.numberOfAttacks = leaderboardPlayers[idx].attackers.length
        }
        return newObj
    })
    att?.sort((firstAttacker: any, secondAttacker: any) =>
        firstAttacker.date < secondAttacker.date ? 1 : -1
    )
    if (att) {
        var newAtt: any = []
        var m = new Map()
        att.map((obj: any) => {
            if (!m.has(obj._id)) {
                m.set(obj._id, obj.date)
                newAtt.push(
                    att.find(
                        (attacker: any) =>
                            attacker._id === obj._id &&
                            attacker.date === obj.date
                    )
                )
            }
            return null
        })
        att = newAtt
    }
    return att && att.length ? att : null
}

export const SendAlert: React.FC = () => {
    const auth = useContext(AuthContext)

    if (auth.state.authAlertMessage)
        return (
            <div className="status-container">
                <p className={`status-message ${auth.state.alertMessageType}`}>
                    {auth.state.authAlertMessage}
                    <i
                        className="fas fa-times"
                        onClick={() => {
                            auth.dispatch({
                                type: AuthActionTypes.CLEAR_MESSAGE,
                                payload: {},
                            })
                        }}
                    ></i>
                </p>
            </div>
        )
    return <div />
}

// Score increase/decrease animation
export const updateScore = (x: Number, decr: boolean, player: any) => {
    var i = x <= 50 ? 1 : 5,
        k = player.state.score

    if (decr) {
        var interval = setInterval(() => {
            player.dispatch({
                type: PlayerActionTypes.UPDATE_SCORE,
                payload: {
                    score: k - i,
                },
            })
            i++
            if (i > x) clearInterval(interval)
        }, 20)
    } else {
        var interval1 = setInterval(() => {
            player.dispatch({
                type: PlayerActionTypes.UPDATE_SCORE,
                payload: {
                    score: k + i,
                },
            })
            i += 5
            if (i > x) clearInterval(interval1)
        }, 10)
    }
}

export const Loading: React.FC = () => {
    return (
        <div className="loading">
            <svg
                version="1.1"
                id="L1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 100 100"
                enableBackground="new 0 0 100 100"
                xmlSpace="preserve"
            >
                <circle
                    fill="none"
                    stroke="#6d30ed"
                    strokeWidth={3}
                    strokeMiterlimit={15}
                    strokeDasharray="14.2472,14.2472"
                    cx={50}
                    cy={50}
                    r={47}
                >
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        dur="5s"
                        from="0 50 50"
                        to="360 50 50"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle
                    fill="none"
                    stroke="#6d30ed"
                    strokeWidth={1}
                    strokeMiterlimit={10}
                    strokeDasharray="10,10"
                    cx={50}
                    cy={50}
                    r={39}
                >
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        dur="5s"
                        from="0 50 50"
                        to="-360 50 50"
                        repeatCount="indefinite"
                    />
                </circle>
                <g fill="#6d30ed">
          {/* <rect x={30} y={35} width={2} height={30}>
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.1" />
          </rect>
          <rect x={40} y={35} width={2} height={30}>
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.2" />
          </rect>
          <rect x={50} y={35} width={2} height={30}>
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" />
          </rect>
          <rect x={60} y={35} width={2} height={30}>
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4" />
          </rect>
          <rect x={70} y={35} width={2} height={30}>
            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.5" />
          </rect> */}
        </g>
            </svg>
            {/* <div className="loader" /> */}
        </div>
    )
}
