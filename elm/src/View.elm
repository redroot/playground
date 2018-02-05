module View exposing (..)

import Html exposing (Html, div, text)
import Msgs exposing (Msg)
import Models exposing (Model, PlayerId)
import Players.Edit
import Players.List
import RemoteData

view : Model -> Html Msg
view model =
    div []
        [ page model ]

page : Model -> Html Msg
page model = -- page takes care of routing depending on the state
    case model.route of
      Models.PlayersRoute ->
        Players.List.view model.players

      Models.PlayerRoute id ->
        playerEditPage model id

      Models.NotFoundRoute ->
        notFoundView

playerEditPage : Model -> PlayerId -> Html Msg
playerEditPage model playerId =
  case model.players of -- players is WebData so need to take all cases into account
      RemoteData.NotAsked ->
          text ""

      RemoteData.Loading ->
          text "Loading ..."

      RemoteData.Success players ->
          let
              maybePlayer =
                players
                  |> List.filter (\player -> player.id == playerId)
                  |> List.head
          in
            case maybePlayer of
                Just player ->
                    Players.Edit.view player
                Nothing ->
                    notFoundView

      RemoteData.Failure error ->
          text (toString error)


notFoundView : Html msg -- type variable as we dont emit messages
notFoundView =
    div []
        [ text "Not found"
        ]
