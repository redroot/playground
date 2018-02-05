module Models exposing (..)

import RemoteData exposing (WebData)

type alias Model =
    { players: WebData (List Player) -- this type at the ended is the success type, Success a
    , route: Route
    }

type Route =
  PlayersRoute
  | PlayerRoute PlayerId
  | NotFoundRoute

initialModel : Route -> Model
initialModel route =
    { players = RemoteData.Loading
    , route = route
    }

type alias PlayerId =
    String

type alias Player =
    { id : PlayerId,
      name: String,
      level: Int
    }
