(ns ^:figwheel-no-load myproject.dev
  (:require
    [myproject.core :as core]
    [devtools.core :as devtools]))

(devtools/install!)

(enable-console-print!)

(core/init!)
