module Commands exposing (..)

import Http
import Json.Decode as Decode
import Json.Encode as Encode
import Json.Decode.Pipeline exposing (decode, required)
import Msgs exposing (Msg)
import Models exposing (PlayerId, Player)
import RemoteData

fetchPlayers : Cmd Msg
fetchPlayers =
  Http.get fetchPlayersUrl playersDecoder -- Http.get takes URL and decoder
    |> RemoteData.sendRequest -- will wrap the request in a WebData type and return a Cmb
    |> Cmd.map Msgs.OnFetchPlayers -- maps the command from one to the other

savePlayerRequest : Player -> Http.Request Player
savePlayerRequest player =
    Http.request
        { body = playerEncoder player |> Http.jsonBody
        , expect = Http.expectJson playerDecoder -- lets use check with the relevant decoder too
        , headers = []
        , method = "PATCH"
        , timeout = Nothing
        , url = savePlayerUrl player.id
        , withCredentials = False
        }

savePlayerCmd : Player -> Cmd Msg
savePlayerCmd player =
    savePlayerRequest player
    |> Http.send Msgs.OnPlayerSave -- create the request,then send it with a callback Update message

fetchPlayersUrl : String
fetchPlayersUrl =
    "http://localhost:4000/players"

savePlayerUrl : PlayerId -> String
savePlayerUrl playerId =
    "http://localhost:4000/players/" ++ playerId

playersDecoder : Decode.Decoder (List Player)
playersDecoder =
  Decode.list playerDecoder

playerDecoder : Decode.Decoder Player
playerDecoder = -- decode in an intuitive way. None of this executes until the command hits program
  decode Player
      |> required "id" Decode.string
      |> required "name" Decode.string
      |> required "level" Decode.int


playerEncoder : Player -> Encode.Value
playerEncoder player =
    let
        attributes =
            [ ( "id", Encode.string player.id )
            , ( "name", Encode.string player.name )
            , ( "level", Encode.int player.level )
            ]
    in
        Encode.object attributes
