package sleepy

import (
  "encoding/json"
	"net/http" // import packages
	"net/url"
)

const (
    GET    = "GET"
    POST   = "POST"
    PUT    = "PUT"
    DELETE = "DELETE"
)

// setup a interface, no 'implements', whether it implements
// or not is determiend automatically
// NB url.Values from `url` package, defined as key => array of strings i.e.
// type url.Values map[string][]string
type Resource interface {
	Get(values url.Values) (int, interface{}) // returns multiple arugments
	Post(values url.Values) (int, interface{}) // int is the status code, interface is anything
	Put(values url.Values) (int, interface{}) 
	Delete(values url.Values) (int, interface{}) 
}

// Lets use stop certain resource methods being called
// called Embedding, if you declare struct A in struct B
// B inherits from A, but all A now recieves the method calls
type GetNotSupported struct {}
type PostNotSupported struct {}
type PutNotSupported struct {}
type DeleteNotSupported struct {}

func (GetNotSupported) Get(values url.Values) (int, interface{}) {
	return 405, ""
}

func (PostNotSupported) Post(values url.Values) (int, interface{}) {
	return 405, ""
}

func (PutNotSupported) Put(values url.Values) (int, interface{}) {
	return 405, ""
}

func (DeleteNotSupported) Delete(values url.Values) (int, interface{}) {
	return 405, ""
}

// api is basically our way of have an object/type response for 
// handling the api, such as adding a resource or Starting the API service
// by having a blank struct this means we can define any method on it
type API struct {}

func (api *API) Abort(rw http.ResponseWriter, statusCode int) {
    rw.WriteHeader(statusCode)
}

// We want to scope how the API struct handles hTTP responses
// so we get it to return a first class function like the original
// response messagE: response(rw http.ResponseWriter, request *http.Request)
// and this (api *API bit at the beginning means its assigned to that struct 
func (api *API) requestHandler(resource Resource) http.HandleFunc {
	func response(rw http.ResponseWriter, request *http.Request) {
		method := request.Method // get HTTP method, assign to var
		request.parseForm() // internal populaed request.Form
		values := request.Form

		var data interface{}
    var code int // instantiate for use later

		switch method {
		case GET:
			code, data = resource.Get(values)
		case POST:
			code, data = resource.Post(values)
		case PUT:
			code, data = resource.Put(values)
		case DELETE:
			code, data = resource.Delete(values)
		default:
      api.Abort(rw, 405)
      return
		}

   content, err := json.Marshal(data)
    if err != nil {
        api.Abort(rw, 500)
    }
    rw.WriteHeader(code)
    rw.Write(content)
	}
}

// Now we define how to add a resource, this lets ake a resource
// which whatevers method it has supported and tell http
// to set the methods implement on that path

func (api *API) AddResource(resource Resource, path string) {
	http.HandleFunc(path, api.requestHandler(resource))
}

func (api *API) Start(port int) {
	portString := fmt.Sprintf(":%d", port)
  http.ListenAndServe(portString, nil)
}
