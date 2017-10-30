## Test Clojurescript App

Following this: https://dhruvp.github.io/2015/02/23/mailchimip-clojure/

- Requires Java 8, Leinenigen
- Run `lein ring server` in one tab, then `line figwheel` in another.

### Notes

*Leiningen* - build tool and repl for conjure
*Ring* - Simple abstraction for HTTP in clojure
*Figwheel* - compiles and livereloads clojurescrpt code
*Reagant* - clojurescript wrapper for React

Reagant extends Atom (mutable data structure in Clojure) to allow us to watch for changes for re-rendering
