module Main exposing (..)

import Commands exposing (fetchPlayers)
import Models exposing (Model, initialModel)
import Msgs exposing (Msg)
import Navigation exposing (Location)
import Routing
import Update exposing (update)
import View exposing (view)

init : Location -> ( Model, Cmd Msg )
init location =
  let
      currentRoute =
          Routing.parseLocation location
  in
    ( initialModel currentRoute, fetchPlayers ) -- initial command is to fetch the players


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

-- MAIN


main : Program Never Model Msg
main =
    Navigation.program Msgs.OnLocationChange -- first param here is the Msg we defined earliy
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
