class User {
  username: string;
  firebase_uid: string;
  constructor(username: string, firebase_uid: string) {
    this.username = username;
    this.firebase_uid = firebase_uid;
  }
}

class Group {
  id: string;
  created_at: Date;
  creator: string; // username in User
  members: Array<string>;
  group_name: string;
    messages: Array<Message>;

  constructor(id, created_at, creator, members, group_name, messages=[]) {
    this.id = id; 
    this.created_at = created_at;
    this.creator = creator;
    this.members = members;
    this.group_name = group_name;
  }
}

class Message {
    message_id: string
    created_at: Date;
    body: string;
    group_id: string; // id in Group
    sender_id: string; // username in User
}