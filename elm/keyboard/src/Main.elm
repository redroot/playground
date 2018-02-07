module Main exposing (..)

import Html exposing (Html, div, text, a, span, program)
import Html.Attributes exposing (class)
import Html.Events exposing (onMouseDown, onMouseUp)
import Platform.Sub exposing (batch)
import String exposing (toLower)
import Debug exposing (log)
import Keyboard exposing (KeyCode, ups, downs)
import Cmds

-- TYPES

type Colour = Black | White
type alias NoteName = String
type alias Note =
    { name: NoteName
    , colour: Colour
    , label: String
    , keyCode: Int
    , playing: Bool
    }

-- MODEL


type alias Model =
    { notes: List Note
    }

initialNotes : List Note
initialNotes =
    [ { name = "C", colour = White, label = "A", keyCode = 65, playing = False }
    , { name = "C#", colour = Black, label = "W", keyCode = 87, playing = False }
    , { name = "D", colour = White, label = "S", keyCode = 83, playing = False }
    , { name = "Eb", colour = Black, label = "E", keyCode = 69, playing = False }
    , { name = "E", colour = White, label = "D", keyCode = 68, playing = False }
    , { name = "F", colour = White, label = "F", keyCode = 70, playing = False }
    , { name = "F#", colour = Black, label = "T", keyCode = 84, playing = False }
    , { name = "G", colour = White, label = "G", keyCode = 71, playing = False }
    , { name = "G#", colour = Black, label = "Y", keyCode = 89, playing = False }
    , { name = "A", colour = White, label = "H", keyCode = 72, playing = False }
    , { name = "Bb", colour = Black, label = "U", keyCode = 85 , playing = False }
    , { name = "B", colour = White, label = "J", keyCode = 75, playing = False }
    ]

init : ( Model, Cmd Msg )
init =
  ( { notes = initialNotes }, Cmd.none )

validKeyCodes : List Int
validKeyCodes =
  List.map (\(n) -> n.keyCode) initialNotes

toFrequency : NoteName -> Float
toFrequency key =
  case key of
    "C" -> 130.81
    "C#" -> 138.59
    "D" -> 146.83
    "Eb" -> 155.56
    "E" -> 164.81
    "F" -> 174.61
    "F#" -> 185.0
    "G" -> 196.0
    "G#" -> 207.65
    "A" -> 220.0
    "Bb" -> 233.08
    "B" -> 246.94
    _ -> 0

-- MESSAGES


type Msg
    = PlayNote Note
    | StopNote Note
    | KeyDown KeyCode
    | KeyUp KeyCode

-- VIEW


keyboardKeyLink : Note -> Html Msg
keyboardKeyLink note =
  let
      baseClass =
        "keyboard-key keyboard-key-colour-" ++ toString(note.colour)
        |> toLower

      playingClass =
        if note.playing then
          " keyboard-key-playing"
        else
          " "

      htmlClass =
        baseClass ++ playingClass

      playMessage =
        PlayNote note

      stopMessage =
        StopNote note
  in
    a [ class htmlClass, onMouseDown playMessage, onMouseUp stopMessage ]
      [ span [ class "keyboard-text" ]
             [ text (note.name ++ " - press " ++ note.label) ]
      ]

view : Model -> Html Msg
view model =
    div [ class "keyboard" ]
        (List.map keyboardKeyLink model.notes)

-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PlayNote note ->
          let
              updatedNote (n) =
                if n.name == note.name then
                  { n | playing = True }
                else
                  n

              updatedNotes =
                List.map updatedNote model.notes

              noteFreq = toFrequency note.name
          in
            log("Updating with Playnote " ++ toString(model.notes))
            ( { model | notes = updatedNotes }, Cmds.sendPlayNote noteFreq )

        StopNote note ->
          let
              updatedNote (n) =
                if n.name == note.name then
                  { n | playing = False }
                else
                  n

              updatedNotes =
                List.map updatedNote model.notes

              noteFreq = toFrequency note.name
          in
            ( { model | notes = updatedNotes }, Cmds.sendStopNote noteFreq  )

        KeyUp keyCode ->
          let
              note =
                List.filter (\x -> x.keyCode == keyCode) model.notes
                |> List.head
          in
            case note of
              Nothing ->
                ( model, Cmd.none )
              Just a ->
                update (StopNote a) model

        KeyDown keyCode ->
          let
              note =
                List.filter (\x -> x.keyCode == keyCode) model.notes
                |> List.head
          in
            case note of
              Nothing ->
                ( model, Cmd.none )
              Just a ->
                update (PlayNote a) model

-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    batch [downs KeyDown, ups KeyUp]

-- MAIN


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
