module Update exposing (..)

import Msgs exposing (Msg)
import Models exposing (Model, Player)
import Routing exposing (parseLocation)
import Commands exposing (savePlayerCmd)
import RemoteData
import Debug exposing (log)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Msgs.OnFetchPlayers response ->
          ( { model | players = response }, Cmd.none )
        Msgs.OnLocationChange location ->
          let
              newRoute =
                parseLocation location
          in
            ( { model | route = newRoute }, Cmd.none )
        Msgs.ChangeLevel player howMuch ->
          let
              updatedPlayer =
                { player | level = player.level + howMuch }
          in
              ( model, savePlayerCmd updatedPlayer )

        Msgs.OnPlayerSave (Ok player) -> -- okay is from Result type
          ( updatePlayer model player, Cmd.none )

        Msgs.OnPlayerSave (Err error) ->
          ( model, Cmd.none )


updatePlayer : Model -> Player -> Model
updatePlayer model updatedPlayer =
  let
      pick currentPlayer =
        if updatedPlayer.id == currentPlayer.id then
          updatedPlayer
        else
          currentPlayer

      updatedPlayerList players =
        List.map pick players

      updatedPlayers =
        RemoteData.map updatedPlayerList model.players -- map here only applies on Success
  in
    { model | players = updatedPlayers }
