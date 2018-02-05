module Msgs exposing (..)

import Http
import Models exposing (Player)
import RemoteData exposing (WebData)
import Navigation exposing (Location)

type Msg
    = OnFetchPlayers (WebData (List Player)) -- called on response from server
    | OnLocationChange Location
    | ChangeLevel Player Int
    | OnPlayerSave (Result Http.Error Player) --
