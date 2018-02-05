https://www.elm-tutorial.org/en/01-foundations/

- Every module must start with a module declaration, and choose what to expose
- imports are explicit
- can make functions generic using stand-ins or type variables to make functions generic, if the type doesn't really matter, e.g. `indexOf : a -> List a -> Int` or `switch: (a, b) -> (b, a)`, tuple of two variables that it reverses. Or even better, funcs as arguments: `map : (a -> b) -> List a -> List b
`
- If you just import e.g. `import Html`, then you have to reference `Html.div` etc but if you import `exposing (div)` then that gts added to local scope.
- You can have union types, e.g. `type Answer = Yes | No`. Could for passing around when a values can be one of many types. `Maybe a = Nothing | Just a` or `Result error value = Ok value | Err err`
- You can also have type aliases, when you can alias a new type to an existing one e.g. `type alias PlayerId = Int; label: PlayerId`
- Records are a hash of key values e.g. `label: { id: Int, name: String } -> String`, they can also be types so are good for models.
- What is the `Maybe` type? `Maybe a = Nothing | Just a`, where Nothing is a function that has a `Maybe a` type and `Just` is a function `a -> Maybe a`. If you want a Maybe calue, you have to use Nothing or Just to create it, so to deal with the data you have to use a Case statement. Useful for optional fields in records, or partial functions that may not return the same type e.g. `getTeenAge : User -> Maybe Int`, then `case user.age of Nothong or Just age`, you know the second type is a Maybe Int type, so you can extract it with Just. Then you can use `List.filterMap` to process only the non-Nothing types of `List Int`. You also have `Maybe.withDefault a default`, which means if it's Nothing you get a default value back.
- Subscriptions are how the application listens for external input like keyboard or mouse events. You can use `Sub.batch` to group listeners together, and `Mouse.clicks` and `Keyboard.downs` which return a subscription to subscribe to in a group using this Sub.batch.
- Commands are how we the runtime to execute things that involve side effects, like random number generation, Time, ajax, localStorage. Can be one or a collection or things to do. Since functions cannot have side effects, we get around that in Elm by having a function return a command value which Html.Program runs.
- `elm reactor` is fine for simple apps, but doesnt work well with external css or and js, so we use webpach.
- View logic feels verbose but not too different from haml back in the day, i like the side effects thing, clear interface with outside world, how does it deal with async I wonder.
- `RemoteData/WebData` seems cools, 4 states: `RemoteData e a = NotAsked | Loading | Failure e | Success a`, rather than loading: boolean, means you can default something to loading or not asked state, but still have the model type as something sensible like `WebData HTTPError (List Player)`
