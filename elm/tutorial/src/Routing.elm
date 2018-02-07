module Routing exposing (..)

import Navigation exposing (Location)
import Models exposing (PlayerId, Route(..))
import UrlParser exposing (..)

matchers : Parser (Route -> a) a -- parser type with func argument, then a thing
matchers =
  oneOf -- from urlPsarser, tries a few parsers, first one tomatch is returned
    [ map PlayersRoute top
    , map PlayerRoute (s "players" </> string) -- </> combines parses, s - exactly this string then string - any string e.g PlayerId
    , map PlayersRoute (s "players")
    ]

parseLocation : Location -> Route
parseLocation location = -- location from url location, trigger one location change.
    case (parseHash matchers location) of -- parse hash from UrlParser
        Just route ->
            route
        Nothing ->
            NotFoundRoute


playersPath : String
playersPath =
    "#players"

playerPath : PlayerId -> String
playerPath id =
  "#players/" ++ id
