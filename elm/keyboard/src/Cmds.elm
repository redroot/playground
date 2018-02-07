port module Cmds exposing (sendPlayNote, sendStopNote)

port playNote : Float -> Cmd msg
port stopNote : Float -> Cmd msg

sendPlayNote : Float -> Cmd msg
sendPlayNote freq = playNote freq

sendStopNote : Float -> Cmd msg
sendStopNote freq = stopNote freq
