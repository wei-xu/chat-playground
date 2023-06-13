import { useRouter, useSegments } from "expo-router";
import {
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, db } from "../config/FirebaseConfig";

export const AuthContext = createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

const PUBLIC_GROUP = 'sfKJ90tWGRYb3l6CPMzE';

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: string) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.

      console.log("redirect to sign-in");
      router.replace("/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments]);
}

export function Provider(props: any) {
  const [user, setAuth] = useState<string>("g0Xi5T1DxycDhvw11P1xC27WqWE3");
  const [username, setUsername] = useState("wxu");
  const [loadingAuth, setLoadingAuth] = useState(false);

  const doRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const usernameRef = doc(db, "users", username);
      const usernameSnap = await getDoc(usernameRef);

      if (usernameSnap.exists()) {
        // stop registering
        // TODO show error message
        console.log("username exists");
        return Promise.reject(new Error("username exists!"));
      }

      const user: UserCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log("username before registering: ", username);
      createUserInDB(user); // what if create user with email succeeds but in db fails?
      // console.log("registered user: ", user);
    } catch (error) {
      console.log("there's something wrong ", error);
    }
  };

  const createUserInDB = (user: UserCredential) => {
    // TODO wrap in one transaction
    // TODO use function param to pass username instead of using state


    const docRef = setDoc(doc(db, "users", username), {
      firebase_uid: user.user.uid,
      email: user.user.email,
      groups: [PUBLIC_GROUP]
    });
    console.log("created user in db, docRef: ", docRef);

    setDoc(doc(db, "usernames", user.user.uid), {
      username: username,
    });
    console.log("register in usernames db");

    
    // add user to public channel
    // add to public sfKJ90tWGRYb3l6CPMzE
    updateDoc(doc(db, "groups", PUBLIC_GROUP), {
      members: arrayUnion(username)
    });

    setUsername("");
  };

  const doSignIn = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      // pull username
      const usernameSnap = await getDoc(doc(db, "usernames", user.user.uid));
      if (usernameSnap.exists()) {
        console.log("signing in as username ", usernameSnap.data().username);
        setUsername(usernameSnap.data().username);
        setAuth(user.user.uid);
      } else {
        throw new Error("username snap doesn't exist");
      }
      console.log("completed signing in", user.user);
    } catch (error) {
      console.log("there's something wrong signing in ", error);
    }
  };

  const doSignOut = async () => {
    try {
      console.log("signing out");
      await signOut(FIREBASE_AUTH);
      setAuth(null);
    } catch (err) {
      console.log("error signing out ", err);
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: doSignIn,
        signOut: doSignOut,
        register: doRegister,
        user,
        username,
        setUsername,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
