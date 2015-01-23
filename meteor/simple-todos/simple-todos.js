// creates a collection on the client, and a cache on the client js for
// interacting with the backend collection
Tasks = new Mongo.Collection("tasks");

// Session is a data store for the cient, similar to mngo collection
// but not synced to server, only set for that user's tab


// we removed the `insecure` module so now client side has no permissions for 
// modifying collectons. we need to define methods here so both server side and cient
// side have access.
// By using Meteor.call we send a request off the the server side and also simulate the change
// on the client side by changing the UI. if the requests is not succssful, we revert the change
// on the client side.

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if(task.private && task.owner !== Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Task.findOne(taskId);
    if(task.private && task.owner !== Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    // validation
    if(task.owner !== Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { private: setToPrivate }});
  }
});

if (Meteor.isClient) {

  // pub sub methods
  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function(){
      if(Session.get("hideCompleted")){
        return Tasks.find({ checked: { $ne: true }}, { sort: { createdAt: -1 }})
      }else{
        return Tasks.find({}, { sort: { createdAt: -1 }})
      }
    },
    hideCompleted: function(){
      return Session.get("hideCompleted")
    },
    incompleteTasksCount: function(){
      return Tasks.find({ checked: { $ne: true }}).count()
    }
  });

  Template.task.helpers({
    isOwner: function(){
      return this.owner === Meteor.userId();
    }
  })

  // add a new event, keyed on event type and select
  Template.body.events({
    "submit .new-task": function (event) {
      var text = event.target.text.value;
      Meteor.call("addTask", text);
      event.target.text.value = "";
      return false; // prevent defautl form submit
    },
    "change .hide-completed input": function () {
      Session.set("hideCompleted", event.target.checked)
    }
  });

  // Scoeped to task
  Template.task.events({
    "click .toggle-checked": function(){
      // this is bound to something related to record, 'indivudual task obkect'
      Meteor.call("setChecked",this._id,!this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask",this._id);
    },
    "click .toggle-private": function(){
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  // accounts module added with - meteor add accounts-ui accounts-password
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("tasks", function() {
    return Tasks.find({
      $or: [
        { private: { $ne: true }},
        { owner: this.userId }
      ]
    });
  });
}
