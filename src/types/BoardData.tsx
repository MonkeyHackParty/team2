import firebase from "firebase/compat/app";
import "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export default interface BoardData {
  boardID: string;
  title: string;
  description: string;
  tags: string[];
  base64: string;
  uploadDate: firebase.firestore.Timestamp;
}
