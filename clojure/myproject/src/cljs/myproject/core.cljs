(ns myproject.core
    (:require [reagent.core :as reagent :refer [atom]]
              [secretary.core :as secretary :include-macros true]
              [accountant.core :as accountant]
              [myproject.validations :as validations]))

;; -------------------------
;; Funcs for views

(defn password-requirements
  "A list to describe which password requirements have been met so far"
  [password requirements]
  [:div
   [:ul (->> requirements
             (filter (fn [req] (not ((:check-fn req) @password))))
             (doall) ;; force effects that dont normally happen in lazy seq to occur
             (map (fn [req] ^{:key req} [:li (:message req)])))]])


(defn input-element
  "An input element which updates its value on change"
  [id name type value in-focus] ;; parameters
  [:input {:id id
           :name name
           :type type
           :class "form-control"
           :required ""
           :value @value
           :on-change #(reset! value (-> % .-target .-value)) ;; reset just sets the value
           :on-focus #(swap! in-focus not) ;; swaps for atoms lets your read current value
           :on-blur #(swap! in-focus not)}])

(defn prompt-message
  "A prompt that will animate to help the user with a given input"
  [message]
  [:div {:class "my-messages"}
    [:div {:class "prompt message-animation"}
      [:p message]]])

(defn email-prompt
  []
  (prompt-message "What's your email address"))

(defn wrap-as-element-in-form
  [element]
  [:div {:class "row form-group"}
   element])

(defn input-and-prompt
  "Creates an input box and a prompt box that appears above the input when focused"
  [label-value input-name input-type input-element-arg prompt-element required?]
  (let [input-focus (atom false)]
    (fn []
      [:div
        [:label label-value]
        (if @input-focus prompt-element [:div]) ;; if cond if-true else , so else a div
        [input-element input-name input-name input-type input-element-arg input-focus]
        (if (and required? (= "" @input-element-arg))
          [:div "Field is required"]
          [:div])])))


;; above on-change is a macro, that reset the value of value using
;; the macroed function. Basically value = e.target.value
;; the @value to apply the value of the value param which is
;; an atom, so @ means value of the atom variable. .- means talking
;; to JS I believe.

(defn email-input
  [email-address-atom]
  [input-element "email" "email" "email" email-address-atom])

(defn email-form
  [email-address-atom]
  (input-and-prompt "email"
                    "email"
                    "email"
                    email-address-atom
                    [prompt-message "What is your email?"]
                    true))

(defn name-form
  [name-atom]
  (input-and-prompt "name"
                    "name"
                    "text"
                    name-atom
                    (prompt-message "What is your name?")
                    true))


(defn password-form
  [password]
  (let [password-type-atom (atom "password")]
    (fn []
      [:div
       [(input-and-prompt "password"
                          "password"
                          @password-type-atom
                          password
                          (prompt-message "What's your password")
                          true)]
       [password-requirements password [{:message "8 or more characters" :check-fn validations/eight-or-more-characters?}
                                        {:message "At least one special character" :check-fn validations/has-special-character?}
                                        {:message "At least one number" :check-fn validations/has-number?}]]])))

;; -------------------------
;; Views

(defn home-page []
  (let [email-address (atom nil)
        name (atom nil)
        password (atom nil)]
    (fn []
      [:div {:class "signup-wrapper"}
       [:h2 "Welcome to TestChimp"]
       [:form
        (wrap-as-element-in-form [email-form email-address])
        (wrap-as-element-in-form [name-form name])
        (wrap-as-element-in-form [password-form password])]])))

(defn about-page []
  [:div [:h2 "About myproject"]
   [:div [:a {:href "/"} "go to the home page"]]])

;; -------------------------
;; Routes

;; we use an atom to determine current route
;; and then define the value of the atom as a reference to a function
(def page (atom #'home-page))

(defn current-page []
  [:div [@page]])

(secretary/defroute "/" []
  (reset! page #'home-page))

(secretary/defroute "/about" []
  (reset! page #'about-page))

;; -------------------------
;; Initialize app

(defn mount-root []
  (reagent/render [current-page] (.getElementById js/document "app")))

(defn init! []
  (accountant/configure-navigation!
    {:nav-handler
     (fn [path]
       (secretary/dispatch! path))
     :path-exists?
     (fn [path]
       (secretary/locate-route path))})
  (accountant/dispatch-current!)
  (mount-root))
